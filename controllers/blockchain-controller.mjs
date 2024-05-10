import { PORT, blockchain } from '../startup.mjs';
import FileHandler from '../utilities/fileHandler.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';
import ErrorResponse from '../utilities/ErrorResponseModel.mjs';
import Blockchain from '../models/Blockchain.mjs';

const blockchainJSON = new FileHandler('data', `blockchain-${PORT}.json`);

const getBlockchain = (req, res, next) => {
  res.status(200).json(new ResponseModel({ status: 200, data: blockchain }));
};

const getAllBlocks = (req, res, next) => {
  res
    .status(200)
    .json(new ResponseModel({ status: 200, data: blockchain.chain }));
};

const getLatestBlock = (req, res, next) => {
  res
    .status(200)
    .json(new ResponseModel({ status: 200, data: blockchain.getLastBlock() }));
};

const getBlockByIndex = (req, res, next) => {
  const index = +req.params.index;
  const block = blockchain.chain[index];

  if (!block) {
    return next(new ErrorResponse(`Block with index ${index} not found`, 404));
  }

  res.status(200).json(new ResponseModel({ status: 200, data: block }));
};

const mineBlock = async (req, res, next) => {
  const body = req.body;

  if (!(body instanceof Object && !(body instanceof Array))) {
    return next(
      new ErrorResponse(`${JSON.stringify(body)} is not a valid Object`, 400)
    );
  }

  const block = blockchain.proofOfWork(body);

  try {
    await broadcastBlocksToNodes(block);
    blockchainJSON.write(blockchain);
    res.status(201).json(new ResponseModel({ status: 201, data: block }));
  } catch (error) {
    return next(new ErrorResponse(error.message, error.status));
  }
};

const broadcastBlocksToNodes = async (block) => {
  await Promise.all(
    blockchain.memberNodes.map(async (url) => {
      await fetch(`${url}/api/v1/blockchain/blocks/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(block),
      });
    })
  );
};

const broadcastBlocks = (req, res, next) => {
  const block = req.body;
  const lastBlock = blockchain.getLastBlock();
  const currentHash = lastBlock.hash === block.previousHash;
  const currentIndex = lastBlock.index + 1 === block.index;

  if (currentHash && currentIndex) {
    blockchain.chain.push(block);
    blockchainJSON.write(blockchain);
    res.status(201).json(new ResponseModel({ status: 201, data: block }));
  } else {
    next(
      new ErrorResponse(`Unable to add the block to ${req.headers.host}`, 400)
    );
  }
};

const syncChain = async (req, res, next) => {
  try {
    await synchronizeWithNodes();
    res.status(200).json(
      new ResponseModel({
        status: 200,
        data: { message: `Synchronization completed on ${blockchain.nodeUrl}` },
      })
    );
  } catch (error) {
    return next(new ErrorResponse(error, error.status));
  }
};

const synchronizeWithNodes = async () => {
  const invalidChains = [];
  let syncCounter = 0;

  const { length: nodesToCheck } = blockchain.memberNodes;

  if (nodesToCheck === 0) {
    throw new ErrorResponse(
      `${blockchain.nodeUrl} is not connected to the network`,
      400
    );
  }

  for (const member of blockchain.memberNodes) {
    try {
      const response = await fetch(`${member}/api/v1/blockchain`);

      if (!response.ok) {
        continue;
      }

      const {
        data: { chain: remoteChain },
      } = await response.json();

      if (remoteChain.length > blockchain.chain.length) {
        if (Blockchain.validateChain(remoteChain)) {
          blockchain.chain = remoteChain;
          blockchainJSON.write(blockchain);
          syncCounter++;
        } else {
          invalidChains.push(member);
        }
      }
    } catch (error) {
      throw new ErrorResponse(error.message, error.status);
    }
  }

  if (invalidChains.length > 0) {
    throw new ErrorResponse(
      `${invalidChains.join(', ')} has been compromised!`,
      400
    );
  }
};

export {
  getBlockchain,
  getAllBlocks,
  getLatestBlock,
  getBlockByIndex,
  mineBlock,
  broadcastBlocks,
  syncChain,
};
