import express from 'express';
import {savePayment, getAllPaymentHistory} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/save', savePayment);
router.get('/history', getAllPaymentHistory);

export default router;
