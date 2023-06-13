require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// create a MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// middleware to parse JSON request bodies
app.use(express.json());

//authentication
//credentials
const users = [{ username: process.env.USER_USERNAME, password: process.env.USER_PASSWORD }];

//function to check if user is authenticated
const authenticate = (req, res) => {
  const authHeader = req.headers['authorization'];
  try {
    const token = jwt.verify(authHeader, process.env.AUTH_TOKEN);
    if (token && token.expiresAt > Date.now()) {
      return true;
    }
  }
  catch (error) { }

  res.status(401).send('Unauthorized');
  return false;
};
//end function to check if user is authenticated

// endpoint to login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userExists = users.some(user => user.username === username && user.password === password);
  if (!userExists) {
    return res.status(401).send('Username or password incorrect');
  }

  const token = jwt.sign({ username: username, expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000 }, process.env.AUTH_TOKEN);
  res.status(200).send(token);
});

//end authentication

// endpoint to add a new user to the database
app.post('/add-user', async (req, res) => {
  if (!authenticate(req, res)) return;
  const { name, email } = req.body;
  try {
    // get a connection from the pool
    const connection = await pool.getConnection();
    // insert the new user into the database
    await connection.query('INSERT INTO customers (name) VALUE (?)', [name]);
    // release the connection back to the pool
    connection.release();
    // return a success message
    res.status(201).send('User added successfully');
  } catch (error) {
    console.error(error);
    // return an error message
    res.status(500).send('Error adding user');
  }
});

// endpoint to get a list of all users in the database
app.get('/list-users', async (req, res) => {
  if (!authenticate(req, res)) return;
  try {
    // get a connection from the pool
    const connection = await pool.getConnection();
    // retrieve all users from the database
    const [rows] = await connection.query('SELECT * FROM customers');
    // release the connection back to the pool
    connection.release();
    // return the list of users
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    // return an error message
    res.status(500).send('Error retrieving users');
  }
});

// endpoint to list all custoemrs and return json
app.get('/list-jusers', async (req, res) => {
  if (!authenticate(req, res)) return;
  try {
    // get a connection from the pool
    const connection = await pool.getConnection();
    // retrieve all users from the database
    const [rows] = await connection.query('SELECT * FROM customers');
    // release the connection back to the pool
    connection.release();
    // return the list of users as JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    // return an error message
    res.status(500).send('Error retrieving users');
  }
});


// endpoint to get a list of all projects in the database
app.get('/list-projects', async (req, res) => {
  if (!authenticate(req, res)) return;
  try {
    // get a connection from the pool
    const connection = await pool.getConnection();
    // retrieve all projects from the database
    const [rows] = await connection.query('SELECT * FROM projects');
    // release the connection back to the pool
    connection.release();
    // return the list of project
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    // return an error message
    res.status(500).send('Error retrieving project');
  }
});

//endpoint to add project, price, customer_id to database
app.post('/add-project', async (req, res) => {
  if (!authenticate(req, res)) return;
  const { project, price, customer_id } = req.body;
  try {
    // get a connection from the pool
    const connection = await pool.getConnection();
    // insert the new user into the database
    await connection.query('INSERT INTO projects (project, price, customer_id) VALUE (?, ?, ?)', [project, price, customer_id]);
    // release the connection back to the pool
    connection.release();
    // return a success message with a button to go to home
    const successMessage = `
    <h2>Project added successfully!</h2>
    <button onclick="location.href='http://arch.francecentral.cloudapp.azure.com';">Go to home</button>
  `;
    res.status(201).send(successMessage);
  } catch (error) {
    console.error(error);
    // return an error message
    res.status(500).send('Error adding project');
  }
});

// endpoint to get a list of all payments in the database
app.get('/list-payments', async (req, res) => {
  if (!authenticate(req, res)) return;
  try {
    // get a connection from the pool
    const connection = await pool.getConnection();
    // retrieve all payments from the database
    const [rows] = await connection.query('SELECT * FROM payments');
    //convert date
    const formattedRows = rows.map(row => ({
      id: row.id,
      payment: row.payment,
      date: new Date(row.date).toLocaleDateString('el-GR'),
      project_id: row.project_id
    }));
    //end convert date
    // release the connection back to the pool
    connection.release();
    // return the list of payments
    res.status(200).send(formattedRows);
  } catch (error) {
    console.error(error);
    // return an error message
    res.status(500).send('Error retrieving payments');
  }
});

app.get('/list-customerprojects', async (req, res) => {
  if (!authenticate(req, res)) return;
  //use try catch to catch errors
  try {
    // get a connection from the pool
    const connection = await pool.getConnection();
    // retrieve all projects of the spesified customer from the database
    const [rows] = await connection.query('SELECT * FROM projects WHERE customer_id = ?', [req.query.customer_id]);
    // release the connection back to the pool
    connection.release();
    // return the list of projects
    res.status(200).send(rows);
  } catch (error) {
    console.error(error);
    // return an error message
    res.status(500).send('Error retrieving projects');
  }
});

app.get('/list-projectspayments', async (req, res) => {
  if (!authenticate(req, res)) return;
  //use try catch to catch errors
  try {
    // get a connection from the pool
    const connection = await pool.getConnection();
    // retrieve all projects of the spesified payment from the database
    const [rows] = await connection.query('SELECT * FROM payments WHERE project_id = ?', [req.query.project_id]);
    //convert date
    const formattedRows = rows.map(row => ({
      id: row.id,
      payment: row.payment,
      date: new Date(row.date).toLocaleDateString('el-GR'),
      project_id: row.project_id
    }));
    //end convert date
    // release the connection back to the pool
    connection.release();
    // return the list of projects
    res.status(200).send(formattedRows);
  } catch (error) {
    console.error(error);
    // return an error message
    res.status(500).send('Error retrieving projects');
  }
});

app.post('/addpayment', async (req, res) => {
  if (!authenticate(req, res)) return;
  try {
    console.log('Received add payment request:', req.body); // Log the received request body
    const { project_id, payment, date } = req.body;
    const connection = await pool.getConnection();
    const formattedDate = new Date(date).toISOString().slice(0, 10);
    const result = await connection.query('INSERT INTO payments (project_id, payment, date) VALUES (?, ?, ?)', [project_id, payment, formattedDate]);
    const paymentId = result.insertId;
    await connection.release();
    res.status(200).json({
      id: paymentId,
      project_id,
      payment,
      date: formattedDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//endpoint to update the projects table on edit
app.put('/update-projects/:id', async (req, res) => {
  if (!authenticate(req, res)) return;
  const projectId = req.params.id;
  const { project, price } = req.body;
  try {
    const connection = await pool.getConnection();
    let query = 'UPDATE projects SET ';
    const values = [];
    if (project) {
      query += 'project = ?, ';
      values.push(project);
    }
    if (price) {
      query += 'price = ?, ';
      values.push(price);
    }
    if (values.length === 0) {
      return res.status(400).send('Bad request: missing project or price parameter.');
    }
    query = query.slice(0, -2); // remove last comma and space
    query += ' WHERE id = ?';
    values.push(projectId);
    const [result] = await connection.query(query, values);
    connection.release();
    if (result.affectedRows === 0) {
      return res.status(404).send(`Project with ID ${projectId} not found.`);
    }
    return res.send('Project updated successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
});
//end update projects

//edit payments
app.put('/update-payments/:id', async (req, res) => {
  if (!authenticate(req, res)) return;
  const paymentId = req.params.id;
  const { payment, date } = req.body;

  // Validate request body
  if (!payment && !date) {
    return res.status(400).json({ error: 'Bad request: missing payment or date parameter.' });
  }

  try {
    const connection = await pool.getConnection();
    let query = 'UPDATE payments SET ';
    const values = [];

    if (payment) {
      query += 'payment = ?, ';
      values.push(payment);
    }
    if (date) {
      query += 'date = ?, ';
      values.push(date);
    }

    if (values.length === 0) {
      return res.status(400).json({ error: 'Bad request: missing payment or date parameter.' });
    }

    query = query.slice(0, -2); // remove last comma and space
    query += ' WHERE id = ?';
    values.push(paymentId);
    const [result] = await connection.query(query, values);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `Payment with ID ${paymentId} not found.` });
    }

    // Construct and return the updated payment object
    const updatedPayment = { id: paymentId, payment, date };
    return res.json(updatedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

//end edit payments

// Update a payment
// Update a payment
app.put('/update-payments/:paymentId', async (req, res) => {
  if (!authenticate(req, res)) return;
  const paymentId = req.params.paymentId;
  const { amount, date } = req.body;

  try {
    // Update the payment in the database using the provided paymentId, amount, and date
    const connection = await pool.getConnection();
    await connection.query('UPDATE payments SET amount = ?, date = ? WHERE id = ?', [amount, date, paymentId]);
    connection.release();

    // Return a success message
    res.status(200).send('Payment updated successfully');
  } catch (error) {
    console.error(error);
    // Return an error message
    res.status(500).send('Error updating payment');
  }
});

//end update payment

//delete payment
app.delete('/delete-payment/:id', async (req, res) => {
  if (!authenticate(req, res)) return;
  try {
    const id = req.params.id;
    // Connect to the database
    const connection = await pool.getConnection();
    // Delete the payment with the specified ID
    await connection.query('DELETE FROM payments WHERE id = ?', [id]);
    // Release the database connection
    connection.release();
    res.status(200).json({ message: 'Payment deleted successfully' }); // Return message as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the payment' }); // Return error message as JSON
  }
});

//end delete payment

// start the server
app.listen(43704, '0.0.0.0', () => {
  console.log('Server started on port 43704');
});
