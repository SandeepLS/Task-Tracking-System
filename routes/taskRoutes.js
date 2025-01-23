const express = require('express');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    addComment,
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);
router.post('/:id/comment', authMiddleware, addComment);
// router.post('/:taskId/comment', authMiddleware, (req, res) => {
//     console.log('Comment route hit');
//     res.status(200).json({ message: 'Route is working' });
// });

module.exports = router;