import express from 'express';
import { verifyFingerprint } from '../controllers/biometricController.js';

const router = express.Router();

router.post('/fingerprint/verify', verifyFingerprint);

export default router;
