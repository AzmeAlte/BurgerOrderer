const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1955',
  database: 'burgerdb'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Initialize currentOrder array
let currentOrder = [];

// Home Page (Root URL)
app.get('/', (req, res) => {
  const html = `
    <h1>Welcome to BurgerOrderer</h1>
    <ul>
      <li><a href="/menu">View Menu</a></li>
      <li><a href="/order-form">Submit an Order</a></li>
      <li><a href="/adjust-order">Adjust or Customize Your Order</a></li>
      <li><a href="/view-order">View Current Order</a></li>
    </ul>
  `;
  res.send(html);
});

// Display menu items
app.get('/menu', (req, res) => {
  const sql = 'SELECT * FROM menu_items';
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching menu items');
    }

    // Generate HTML table for menu items
    let html = '<h1>Menu Items</h1>';
    html += '<table border="1"><tr><th>Name</th><th>Type</th><th>Price</th><th>Customizations</th></tr>';

    result.forEach(item => {
      html += `<tr>
                 <td>${item.name}</td>
                 <td>${item.type}</td>
                 <td>${item.price}</td>
                 <td>${item.customization_options || 'None'}</td>
               </tr>`;
    });

    html += '</table><br><a href="/">Back to Home</a>';
    res.send(html);
  });
});

// Submit an order
// Submit an order
app.post('/order', async (req, res) => {
  const order = req.body;
  currentOrder = order.items;  // Store the order items in currentOrder

  try {
    const response = await axios.post('http://localhost:4000/order', order);
    console.log('Order successfully sent to KitchenView:', response.data);
    res.send('Order submitted to KitchenView');
  } catch (error) {
    console.error('Error sending order to KitchenView:', error);
    res.status(500).send('Error sending order to KitchenView');
  }
});

// Form to submit an order (HTML)
app.get('/order-form', (req, res) => {
  const html = `
    <h1>Order Items</h1>
    <form action="/order" method="post">
      <label for="customerName">Customer Name:</label>
      <input type="text" id="customerName" name="customerName"><br>
      <label for="item1">Metric Ton Bacon Burger:</label>
      <input type="number" id="item1" name="items[0][quantity]" min="0">
      <input type="hidden" name="items[0][name]" value="Metric Ton Bacon Burger"><br>
      <label for="item2">Fries:</label>
      <input type="number" id="item2" name="items[1][quantity]" min="0">
      <input type="hidden" name="items[1][name]" value="Fries"><br>
      <label for="item3">Soda:</label>
      <input type="number" id="item3" name="items[2][quantity]" min="0">
      <input type="hidden" name="items[2][name]" value="Soda"><br>
      <button type="submit">Submit Order</button>
    </form><br><a href="/">Back to Home</a>
  `;
  res.send(html);
});

// Remove item from order
app.post('/remove-item', (req, res) => {
  const { itemId } = req.body;
  currentOrder = currentOrder.filter(item => item.id !== itemId);
  res.send('Item removed from order<br><a href="/">Back to Home</a>');
});

// Customize an item
app.post('/customize-item', (req, res) => {
  const { itemId, customizations } = req.body;
  const item = currentOrder.find(item => item.id === itemId);
  if (item) {
    item.customizations = customizations;
    res.send('Customizations added<br><a href="/">Back to Home</a>');
  } else {
    res.status(404).send('Item not found<br><a href="/">Back to Home</a>');
  }
});

// Form for adjusting and customizing items (HTML)
app.get('/adjust-order', (req, res) => {
  const html = `
    <h1>Adjust Order</h1>
    <form action="/customize-item" method="post">
      <label for="itemId">Item ID:</label>
      <input type="text" id="itemId" name="itemId"><br>
      <label for="customizations">Customizations:</label><br>
      <input type="checkbox" name="customizations[onions]" value="false"> No Onions<br>
      <input type="checkbox" name="customizations[cheese]" value="true"> Add Cheese<br>
      <button type="submit">Submit Customizations</button>
    </form><br><a href="/">Back to Home</a>
  `;
  res.send(html);
});

// View current order
app.get('/view-order', (req, res) => {
  let html = '<h1>Current Order</h1>';
  
  // Check if currentOrder is defined and has a length
  if (Array.isArray(currentOrder) && currentOrder.length > 0) {
    html += '<ul>';
    currentOrder.forEach(item => {
      html += `<li>${item.quantity} x ${item.name}</li>`;
    });
    html += '</ul>';
  } else {
    html += '<p>No items in the current order.</p>';
  }

  html += '<br><a href="/">Back to Home</a>';
  res.send(html);
});

app.listen(port, () => {
  console.log(`BurgerOrderer app listening at http://localhost:${port}`);
});