const express = require('express');

const app = express();

const cors = require('cors');

app.use(cors());

app.use(express.json());

let products = [];

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const product = products.find((p) => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/products', (req, res) => {
  const body = req.body;
  const product = {...body, id: String(products.length + 1)}
  products.push(product);
  res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
  const id = req.params.id;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...req.body };
    res.json(products[productIndex]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/products/:id', (req, res) => {
  const id = req.params.id;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct[0]);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});


let cart = [];
app.get('/cart', (req, res) => {
  const cartItems = products.filter((product) => product.quantity > 0);
  const totalQuantity = cartItems.reduce((total, product) => total + product.quantity, 0);
  res.json({ items: cartItems, quantity: totalQuantity });
});

app.post('/cart', (req, res) => {
  const productId = req.body.productId;
  const product = products.find((p) => p.id === productId);
  if (product) {
    product.quantity = product.quantity || 0;
    product.quantity++;
    res.status(201).json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.put('/cart/:id', (req, res) => {
  const productId = req.params.id;
  const product = products.find((p) => p.id === productId);
  if (product) {
    const quantity = req.body.quantity;
    if (quantity < 1) {
      product.quantity = 0;
    } else {
      product.quantity = quantity;
    }
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found in cart' });
  }
});

app.delete('/cart/:id', (req, res) => {
  const productId = req.params.id;
  const product = products.find((p) => p.id === productId);
  if (product) {
    product.quantity = 0;
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found in cart' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});