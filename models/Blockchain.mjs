import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';
import { PORT, NODE_URL, MINE_RATE } from '../startup.mjs';
import FileHandler from '../utilities/fileHandler.mjs';

class Blockchain {
  constructor({ name, chain, memberNodes, nodeUrl }) {
    this.name = name || 'Blockchain';
    this.chain = chain || [Blockchain.createGenesisBlock()];
    this.memberNodes = memberNodes || [];
    this.nodeUrl = nodeUrl || NODE_URL;
  }

  createBlock(data) {
    const block = new Block(
      this.chain.length,
      Date.now(),
      this.getLastBlock().hash,
      data
    );

    block.hash = Blockchain.hashBlock(block);
    return block;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(data) {
    const lastBlock = this.getLastBlock();
    const block = this.createBlock(data);

    let { nonce, difficulty } = lastBlock;
    let timestamp, hash;

    do {
      timestamp = Date.now();
      nonce++;
      difficulty = Blockchain.adjustDifficulty(lastBlock, timestamp);
      hash = Blockchain.hashBlock({ ...block, timestamp, nonce, difficulty });
    } while (!hash.startsWith('0'.repeat(difficulty)));

    Object.assign(block, { timestamp, hash, nonce, difficulty });

    this.chain.push(block);
    return block;
  }

  static createChain(name) {
    const blockchainJSON = new FileHandler('data', `blockchain-${PORT}.json`);
    let blockchain = blockchainJSON.read(true);

    if (
      !blockchain ||
      Object.keys(blockchain).toString() !==
        Object.keys(new this({})).toString()
    ) {
      blockchain = new this({ name });
      blockchainJSON.write(blockchain);
    } else {
      blockchain = new this(blockchain);
    }

    return blockchain;
  }

  static createGenesisBlock() {
    return new Block(0, Date.now(), null, []);
  }

  static hashBlock(block) {
    const stringToHash = (
      block.index +
      block.timestamp +
      block.previousHash +
      JSON.stringify(block.data) +
      block.nonce +
      block.difficulty
    ).toString();

    return createHash(stringToHash);
  }

  static adjustDifficulty(block, timestamp) {
    let { difficulty } = block;

    if (difficulty < 1) return 1;

    return timestamp - block.timestamp > MINE_RATE
      ? +difficulty + 1
      : +difficulty - 1;
  }

  static validateChain(chain) {
    const replacer = ['index', 'previousHash', 'hash', 'data', 'nonce'];
    const firstBlock = JSON.stringify(chain[0], replacer);
    const genesisBlock = JSON.stringify(this.createGenesisBlock(), replacer);

    if (firstBlock !== genesisBlock) return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const previousBlock = chain[i - 1];
      const hash = this.hashBlock(block);

      if (hash !== block.hash || block.previousHash !== previousBlock.hash)
        return false;
    }

    return true;
  }
}

export default Blockchain;
