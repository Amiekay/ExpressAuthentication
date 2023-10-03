const fs = require('fs');
const path = require('path');

// Load inventory data from items.json
const dataFilePath = path.join(__dirname, '..', 'items.json');
let inventory = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

// Create an item
exports.createItem = (req, res) => {
  // Check if any of the required fields are missing
  if (!req.body.name || !req.body.price || !req.body.size) {
    return res.status(400).json({
      error: 'Missing required fields. Name, price, and size are required.',
    });
  }
  const { name, price, size } = req.body;
  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' });
  }
  // Check if the size is valid
  if (!isValidSize(size)) {
    return res
      .status(400)
      .json({ error: 'Invalid size. Size must be small, medium, or large.' });
  }
  const newItem = {
    id: Date.now().toString(),
    name,
    price,
    size,
  };

  inventory.push(newItem);
  fs.writeFileSync(dataFilePath, JSON.stringify(inventory), 'utf-8');

  res.status(201).json(newItem);
};

// Get all items
exports.getAllItems = (req, res) => {
  // Check if the user is an admin
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Permission denied' });
  }
  const inventoryFilter = req.query.inventory;

  let filteredinventory = inventory;

  if (inventoryFilter) {
    filteredinventory = inventory.filter((item) => item.name === inventoryFilter);
  }

  res.json(filteredinventory);
};

// Get one item by ID
exports.getOneItem = (req, res) => {
  // Check if the user is an admin
  if (req.user.role !== 'user') {
    return res.status(403).json({ error: 'Permission denied' });
  }
  res.json(req.item);
};

// Update an item by ID
exports.updateItem = (req, res) => {
  // Check if any of the required fields are missing
  if (!req.body.name || !req.body.price || !req.body.size) {
    return res.status(400).json({
      error: 'Missing required fields. Name, price, and size are required.',
    });
  }
  const { name, price, size } = req.body;
  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' });
  }
  // Check if the size is valid
  if (!isValidSize(size)) {
    return res
      .status(400)
      .json({ error: 'Invalid size. Size must be small, medium, or large.' });
  }
  const updatedItem = {
    id: req.item.id,
    name,
    price,
    size,
  };

  const index = inventory.findIndex((i) => i.id === req.item.id);
  inventory[index] = updatedItem;
  fs.writeFileSync(dataFilePath, JSON.stringify(inventory), 'utf-8');

  res.json(updatedItem);
};

// Delete an item by ID
exports.deleteItem = (req, res) => {
  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' });
  }
  inventory = inventory.filter((i) => i.id !== req.item.id);
  fs.writeFileSync(dataFilePath, JSON.stringify(inventory), 'utf-8');

  res.status(204).send();
};

function isValidSize(size) {
  const lowerCaseSize = size.toLowerCase();
  return ['small', 'medium', 'large'].includes(lowerCaseSize);
}

exports.validateItem = (req, res, next) => {
  const itemId = req.params.id;

  // Find the item by ID in the inventory
  const item = inventory.find((i) => i.id === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  req.item = item;
  next();
};
