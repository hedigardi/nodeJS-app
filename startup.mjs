import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Blockchain from './models/Blockchain.mjs';

global.__appdir = dirname(fileURLToPath(import.meta.url));

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 5001;
const NODE_URL = process.argv[3] || 'http://localhost:5001';

const DIFFICULTY = parseInt(process.env.DIFFICULTY) || 1;
const MINE_RATE = parseInt(process.env.MINE_RATE) || 1000;

const blockchain = Blockchain.createChain('Blockchain');

export { PORT, NODE_URL, DIFFICULTY, MINE_RATE, blockchain };
