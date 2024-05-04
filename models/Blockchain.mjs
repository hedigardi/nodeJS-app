import { createHash } from '../utilities/crypto-lib.mjs';
import Block from './Block.mjs';

export default class Blockchain {
  constructor() {
    this.chain = [];
    this.createBlock(Date.now(), '0', '0', []);
  }

  createBlock(
    timestamp,
    previousBlockHash,
    currentBlockHash,
    data,
    difficulty
  ) {
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data,
      difficulty
    );

    this.chain.push(block);

    return block;
  }

  getAllBlocks() {
    return this.chain;
  }

  getLastBlock() {
    return this.chain.at(-1);
  }

  hashBlock(timestamp, previousBlockHash, currentBlockData, nonce, difficulty) {
    const stringToHash =
      timestamp.toString() +
      previousBlockHash +
      JSON.stringify(currentBlockData) +
      nonce +
      difficulty;
    const hash = createHash(stringToHash);

    return hash;
  }

  proofOfWork(previousBlockHash, data) {
    const lastBlock = this.getLastBlock();
    let difficulty, hash, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();

      difficulty = this.difficultyAdjustment(lastBlock);
      hash = this.hashBlock(
        timestamp,
        previousBlockHash,
        data,
        nonce,
        difficulty
      );
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return { nonce, difficulty, timestamp };
  }

  difficultyAdjustment(lastBlock) {
    const MINE_RATE = process.env.MINE_RATE;
    let { difficulty, timestamp } = lastBlock;

    return timestamp + MINE_RATE > timestamp
      ? +difficulty + 1
      : +difficulty - 1;
  }
}
