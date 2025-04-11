import express from 'express';
import { savePayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/save', savePayment);

export default router;
