import { dirname } from 'path';
import { fileURLToPath } from 'url';

import Blockchain from './models/Blockchain.mjs';
import FileHandler from './utilities/fileHandler.mjs';

global.__appdir = dirname(fileURLToPath(import.meta.url));

const setupBlockchain = () => {
  const blockchainJSON = new FileHandler(
    'data',
    `blockchain-${process.argv[2]}.json`
  );

  let blockchain = blockchainJSON.read(true);

  if (Object.keys(blockchain).length === 0) {
    blockchain = new Blockchain();

    blockchainJSON.write(blockchain);
  } else {
    Object.setPrototypeOf(blockchain, Blockchain.prototype);
  }

  return blockchain;
};

const blockchain = setupBlockchain();

export { blockchain };
