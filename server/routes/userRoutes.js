const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddlleware');
const { getUsers, searchUsers } = require('../controllers/userController');

router.get('/', authMiddleware, getUsers);
router.get('/search', authMiddleware, searchUsers);

module.exports = router;