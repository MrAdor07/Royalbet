const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentMethodController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/methods', paymentController.getPaymentMethods);
router.post('/add-method', paymentController.addPaymentMethod);
router.post('/update-method', paymentController.updatePaymentMethod);

module.exports = router;