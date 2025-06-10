const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/dashboard', agentController.getDashboard);
router.post('/create-user', agentController.createUser);
router.get('/users', agentController.getUsers);

module.exports = router;