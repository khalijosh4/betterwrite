const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jobController = require('../controllers/jobController');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Job routes
router.post('/jobs', auth, jobController.createJob);
router.post('/jobs/:jobId/bids', auth, jobController.submitBid);
router.put('/bids/:bidId/accept', auth, jobController.acceptBid);

// Payment routes
router.post('/jobs/:jobId/payment', auth, paymentController.createPaymentIntent);
router.post('/jobs/:jobId/payment/confirm', auth, paymentController.confirmPayment);

module.exports = router;