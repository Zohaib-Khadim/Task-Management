const db = require('../config/db');

const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

const searchUsers = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Search query is required' });

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE full_name LIKE ?',
      [`%${q}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Error searching users', error: err.message });
  }
};

module.exports = { getUsers, searchUsers };