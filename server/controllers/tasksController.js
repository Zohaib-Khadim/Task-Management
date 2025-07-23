const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const getTasks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
};

const addTask = [
  upload.single('file'),
  async (req, res) => {
    const { title, assignee_id, status = 'todo', description, priority = 'medium', due_date } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO tasks (title, description, status, priority, assignee_id, due_date, attachment_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [title, description || null, status, priority, assignee_id ? parseInt(assignee_id) : null, due_date || null, req.file ? `/uploads/${req.file.filename}` : null]
      );
      const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
      res.status(201).json(rows[0]); // Return full task object
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Error adding task', error: err.message });
    }
  },
];

const updateTask = [
  upload.single('file'),
  async (req, res) => {
    const { id } = req.params;
    const { status, title, description, priority, due_date } = req.body;
    try {
      const [result] = await db.query(
        'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, attachment_url = ? WHERE id = ?',
        [title, description || null, status, priority || 'medium', due_date || null, req.file ? `/uploads/${req.file.filename}` : null, id]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
      const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
      res.json(rows[0]);
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Error updating task', error: err.message });
    }
  },
];

const uploadFileToTask = [
  upload.single('file'),
  async (req, res) => {
    const { taskId } = req.params;
    try {
      const [result] = await db.query(
        'UPDATE tasks SET attachment_url = ?, updated_at = NOW() WHERE id = ?',
        [req.file ? `/uploads/${req.file.filename}` : null, taskId]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
      const [rows] = await db.query('SELECT attachment_url FROM tasks WHERE id = ?', [taskId]);
      res.json({ attachment_url: rows[0].attachment_url });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
  },
];

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT attachment_url FROM tasks WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });

    const task = rows[0];
    if (task.attachment_url) {
      const filePath = path.join(__dirname, '..', task.attachment_url);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }

    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};

const endTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const [result] = await db.query(
      'UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?',
      ['done', taskId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.json({ message: 'Task marked as done', task: rows[0] });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error ending task', error: err.message });
  }
};

module.exports = { getTasks, addTask, updateTask, uploadFileToTask, deleteTask, endTask };