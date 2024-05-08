import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

const Blockchain = class {
  constructor(name) {
    this.name = name || 'Blockchain';
    this.chain = [];
    this.createGenesisBlock();

    this.memberNodes = [];
    this.nodeUrl = process.argv[3];
  }

  createGenesisBlock() {
    const block = new Block(0, Date.now(), null, []);
    this.chain.push(block);
  }

  createBlock(data) {
    const block = new Block(
      this.chain.length,
      Date.now(),
      this.getLastBlock().hash,
      data
    );
    block.hash = this.hashBlock(block);

    this.chain.push(block);
    return block;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  hashBlock(block) {
    const stringToHash = (
      block.index +
      block.timestamp +
      block.previousHash +
      block.data +
      block.nonce +
      block.difficulty
    ).toString();

    return createHash(stringToHash);
  }

  proofOfWork(data) {
    const lastBlock = this.getLastBlock();
    const block = this.createBlock(data);

    let difficulty, hash, timestamp;
    let nonce = 0;

    do {
      timestamp = Date.now();
      nonce++;
      difficulty = this.adjustDifficulty(lastBlock, timestamp);
      hash = this.hashBlock({
        ...block,
        timestamp,
        nonce,
        difficulty,
        previousBlockHash: lastBlock.currentBlockHash,
      });
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    Object.assign(block, { timestamp, hash, nonce, difficulty });

    return block;
  }

  adjustDifficulty(lastBlock, timestamp) {
    const MINE_RATE = process.env.MINE_RATE;
    let { difficulty } = lastBlock;

    if (difficulty < 1) return 1;

    return timestamp - lastBlock.timestamp > MINE_RATE
      ? +difficulty + 1
      : +difficulty - 1;
  }
};

export default Blockchain;
