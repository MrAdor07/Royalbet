const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verifyAdmin = require('../middlewares/verifyAdmin');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.use(verifyAdmin);

router.get('/dashboard', adminController.getDashboard);
router.post('/assign-balance', adminController.assignBalance);
router.get('/sub-admins', adminController.getSubAdmins);
router.post('/create-sub-admin', adminController.createSubAdmin);
router.post('/remove-sub-admin', adminController.removeSubAdmin);

module.exports = router;
