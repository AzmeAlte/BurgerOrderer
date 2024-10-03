const express = require('express');
const app = express();
const port = 4000;

// In-memory storage for orders
let orders = [];

app.use(express.json());

// API endpoint to receive orders from BurgerOrderer
app.post('/order', (req, res) => {
  const newOrder = req.body;

  // Check if the order has the necessary information
  if (!newOrder || !newOrder.customerName || !newOrder.items) {
    return res.status(400).send('Invalid order received');
  }

  orders.push(newOrder); // Add the new order to the orders array
  console.log('New order received:', newOrder);
  res.send('Order received by KitchenView');
});

// API endpoint to display all received orders in a simple HTML table
app.get('/orders', (req, res) => {
  let html = '<h1>Received Orders</h1>';
  
  if (orders.length > 0) {
    html += '<table border="1"><tr><th>Customer Name</th><th>Items</th></tr>';
    orders.forEach(order => {
      html += `<tr>
                 <td>${order.customerName}</td>
                 <td>
                   <ul>`;
      
      order.items.forEach(item => {
        html += `<li>${item.quantity} x ${item.name}</li>`;
      });

      html += `</ul>
               </td>
             </tr>`;
    });
    html += '</table>';
  } else {
    html += '<p>No orders have been received yet.</p>';
  }

  html += '<br><a href="/">Back to Home</a>';
  res.send(html);
});

// Home page to give an overview and link to orders page
app.get('/', (req, res) => {
  const html = `
    <h1>Welcome to KitchenView</h1>
    <ul>
      <li><a href="/orders">View Received Orders</a></li>
    </ul>
  `;
  res.send(html);
});

// Start the server
app.listen(port, () => {
  console.log(`KitchenView app listening at http://localhost:${port}`);
});