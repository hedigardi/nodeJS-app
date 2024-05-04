import express from 'express';

import {
  createBlock,
  getBlockchain,
  getBlockByIndex,
} from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.route('/').get(getBlockchain);
router.route('/:index').get(getBlockByIndex);
router.route('/mine').post(createBlock);

export default router;
