const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// @route   GET api/transactions
// @desc    Get all user transactions
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/transactions
// @desc    Add new transaction
// @access  Private
router.post(
  '/',
  auth,
  [
    body('title', 'Title is required').not().isEmpty().trim(),
    body('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
    body('type', 'Type must be credit or debit').isIn(['credit', 'debit']),
    body('category', 'Category is required').not().isEmpty().trim(),
    body('date').optional().isISO8601().withMessage('Invalid date format')
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), msg: errors.array()[0].msg });
    }

    try {
      const { title, amount, type, category, date } = req.body;

      const newTransaction = new Transaction({
        title,
        amount,
        type,
        category,
        date: date || Date.now(),
        userId: req.user.id
      });

      const transaction = await newTransaction.save();
      res.json(transaction);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete(
  '/:id',
  auth,
  [
    param('id', 'Invalid transaction ID').isMongoId()
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), msg: errors.array()[0].msg });
    }

    try {
      const transaction = await Transaction.findById(req.params.id);

      if (!transaction) {
        return res.status(404).json({ msg: 'Transaction not found' });
      }

      // Make sure user owns transaction
      if (transaction.userId.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      await transaction.deleteOne();
      res.json({ msg: 'Transaction removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;