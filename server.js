const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Render index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// API routes for inventory
const inventoryRouter = require('./routes/inventory');
const userRouter = require('./routes/users');
app.use('/api', inventoryRouter);
app.use('/api', userRouter);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
