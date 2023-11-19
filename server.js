const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost', // Replace with your PostgreSQL host
  database: 'onlineticket', // Replace with your PostgreSQL database name
  password: 'Sarveshb@1', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

app.use(express.json());

app.post('/api/users', async (req, res) => {
  const { name, seat } = req.body;
  try {
    const client = await pool.connect();
    const query = 'INSERT INTO users (name, seat) VALUES ($1, $2) RETURNING *';
    const values = [name, seat];
    const result = await client.query(query, values);
    const savedUser = result.rows[0];
    client.release();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving the user.' });
  }
});


// Endpoint to register a new user
app.post('/api/register', async (req, res) => {
  const { name, password } = req.body;
  try {
    const client = await pool.connect();
    const registrationQuery = 'INSERT INTO registration (name, password) VALUES ($1, $2) RETURNING *';
    const registrationValues = [name, password];
    const registrationResult = await client.query(registrationQuery, registrationValues);
    const registeredUser = registrationResult.rows[0];

    const loginQuery = 'INSERT INTO login (name, password) VALUES ($1, $2)';
    const loginValues = [name, password];
    await client.query(loginQuery, loginValues);

    client.release();
    res.json(registeredUser);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});

// Endpoint to authenticate and login a user
app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const client = await pool.connect();
    const query = 'SELECT * FROM login WHERE name = $1 AND password = $2';
    const values = [name, password];
    const result = await client.query(query, values);
    const loggedInUser = result.rows[0];
    client.release();
    if (loggedInUser) {
      res.json(loggedInUser);
    } else {
      res.status(401).json({ error: 'Invalid login credentials.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
