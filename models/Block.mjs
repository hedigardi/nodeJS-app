export default class Block {
  constructor(index, timestamp, previousHash, data) {
    this.index = index;
    this.timestamp = timestamp;
    this.previousHash = previousHash;
    this.hash = '0';
    this.data = data;
    this.nonce = 0;
    this.difficulty = +process.env.DIFFICULTY || 1;
  }
}
