import { Router } from 'express';
import {
  getMemberNodes,
  createMemberNode,
} from '../controllers/members-controller.mjs';

const router = Router();

router.route('/').get(getMemberNodes);
router.route('/register-node').post(createMemberNode);

export default router;
