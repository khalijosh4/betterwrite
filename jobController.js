const Job = require('../models/Job');
const Bid = require('../models/Bid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createJob = async (req, res) => {
  try {
    const { title, description, payment } = req.body;
    const job = new Job({
      title,
      description,
      payment,
      client: req.user._id,
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.submitBid = async (req, res) => {
  try {
    const { jobId, amount } = req.body;
    const bid = new Bid({
      job: jobId,
      worker: req.user._id,
      amount,
    });
    await bid.save();
    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId).populate('job');
    
    if (bid.job.client.toString() !== req.user._id.toString()) {
      throw new Error('Unauthorized');
    }
    
    bid.status = 'accepted';
    bid.job.status = 'in_progress';
    bid.job.worker = bid.worker;
    
    await bid.save();
    await bid.job.save();
    
    res.json(bid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
