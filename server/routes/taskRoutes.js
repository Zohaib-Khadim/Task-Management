const express = require('express');
const authMiddleware = require('../middleware/authMiddlleware');
const { getTasks, addTask, updateTask, uploadFileToTask ,deleteTask,endTask} = require('../controllers/tasksController');

const router = express.Router();

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, addTask);
router.put('/:id', authMiddleware, updateTask);
router.post('/:taskId/upload', authMiddleware, uploadFileToTask);
router.delete("/:id",authMiddleware,deleteTask)
router.post('/:taskId/end',authMiddleware, endTask);

module.exports = router;