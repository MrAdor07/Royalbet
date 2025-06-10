const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // Protect all below routes

router.post('/deposit', transactionController.deposit);
router.post('/withdraw', transactionController.withdraw);
router.get('/history', transactionController.getTransactionHistory);
router.get('/search', transactionController.searchTransactions);
router.get('/all', transactionController.getTransactions); // for admin

module.exports = router;
