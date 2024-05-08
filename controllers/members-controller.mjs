import { blockchain } from '../startup.mjs';
import ErrorResponse from '../utilities/ErrorResponseModel.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';
import FileHandler from '../utilities/fileHandler.mjs';

const getMemberNodes = (req, res, next) => {
  res
    .status(200)
    .json(new ResponseModel({ status: 200, data: blockchain.memberNodes }));
};

const createMemberNode = (req, res, next) => {
  const node = req.body.nodeUrl;

  if (
    !(
      blockchain.memberNodes.indexOf(node) === -1 && blockchain.nodeUrl !== node
    )
  ) {
    return next(
      new ErrorResponse(
        `${node} is already registered on the ${blockchain.name}`,
        400
      )
    );
  }

  blockchain.memberNodes.push(node);
  syncMemberNodes(node, next);

  new FileHandler('data', `blockchain-${process.argv[2]}.json`).write(
    blockchain
  );

  res.status(201).json(
    new ResponseModel({
      status: 201,
      data: {
        message: `${node} has been registered on the ${blockchain.name}`,
      },
    })
  );
};

const syncMemberNodes = (url, next) => {
  const members = [...blockchain.memberNodes, blockchain.nodeUrl];

  try {
    members.forEach(async (member) => {
      await fetch(`${url}/api/v1/members/register-node`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeUrl: member }),
      });
    });
  } catch (error) {
    return next(new ErrorResponse(error, error.status));
  }
};

export { getMemberNodes, createMemberNode };
