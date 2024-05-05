import express from 'express';

import {
  getBlockchain,
  getAllBlocks,
  getLatestBlock,
  getBlockByIndex,
  mineBlock,
  syncChain,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.route('/').get(getBlockchain);
router.route('/blocks').get(getAllBlocks);
router.route('/blocks/:index').get(getBlockByIndex);
router.route('/blocks/latest').get(getLatestBlock);
router.route('/mine').post(mineBlock);
router.route('/consensus').get(syncChain);

export default router;
