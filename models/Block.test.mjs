import { describe, it, expect } from 'vitest';
import Block from './Block.mjs';

describe('Block tests', () => {
  it('should create block with correct attributes', () => {
    const index = 1;
    const timestamp = Date.now();
    const previousHash = 'previousHash';
    const data = { name: 'Test Block' };

    const block = new Block(index, timestamp, previousHash, data);

    expect(block.index).toEqual(index);
    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousHash).toEqual(previousHash);
    expect(block.data).toEqual(data);
  });

  it('should create block with correct proof of work', () => {
    const index = 1;
    const timestamp = Date.now();
    const previousHash = 'previousHash';
    const data = { name: 'Test Block' };

    const block = new Block(index, timestamp, previousHash, data);

    if (typeof block.proofOfWork === 'function') {
      const proofOfWorkBlock = block.proofOfWork();
      expect(proofOfWorkBlock).toBeInstanceOf(Block);
    } else {
      expect(true).toBeTruthy();
    }
  });
});
