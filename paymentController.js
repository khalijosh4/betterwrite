const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Job = require('../models/Job');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    
    if (job.client.toString() !== req.user._id.toString()) {
      throw new Error('Unauthorized');
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: job.payment * 100, // Convert to cents
      currency: 'usd',
      metadata: { jobId },
    });
    
    job.paymentIntentId = paymentIntent.id;
    job.paymentStatus = 'processing';
    await job.save();
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    
    const paymentIntent = await stripe.paymentIntents.retrieve(job.paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      job.paymentStatus = 'completed';
      job.status = 'completed';
      job.completedAt = new Date();
      await job.save();
      
      res.json({ success: true });
    } else {
      throw new Error('Payment not successful');
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};