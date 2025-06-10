const express = require('express');
const router = express.Router();
const bonusController = require('../controllers/bonusController');
const authMiddleware = require('../middlewares/authMiddleware');
const verifyBonusClaim = require('../middlewares/verifyBonusClaim');

router.use(authMiddleware);

router.post('/claim', verifyBonusClaim, bonusController.claimBonus);
router.get('/status', bonusController.getBonusStatus);

module.exports = router;