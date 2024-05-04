import { blockchain } from '../startup.mjs';
import ErrorResponse from '../utilities/ErrorResponseModel.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';
import fileHandler from '../utilities/fileHandler.mjs';

const getBlockchain = (req, res, next) => {
  res
    .status(200)
    .json(new ResponseModel({ statusCode: 200, data: blockchain }));
};

const createBlock = (req, res, next) => {
  const lastBlock = blockchain.getLastBlock();
  const data = req.body;
  const { nonce, difficulty, timestamp } = blockchain.proofOfWork(
    lastBlock.currentBlockHash,
    data
  );

  const currentBlockHash = blockchain.hashBlock(
    timestamp,
    lastBlock.currentBlockHash,
    data,
    nonce,
    difficulty
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currentBlockHash,
    currentBlockHash,
    data,
    difficulty
  );

  res.status(201).json(new ResponseModel({ statusCode: 201, data: block }));
};

const getBlockByIndex = (req, res, next) => {
  const blockIndex = parseInt(req.params.index);
  const block = blockchain.chain[blockIndex - 1];

  if (!block) {
    return next(
      new ErrorResponse(`Could't find the block with index: ${blockIndex}`, 404)
    );
  }

  res.status(200).json(new ResponseModel({ statusCode: 200, data: block }));
};

export { createBlock, getBlockchain, getBlockByIndex };
