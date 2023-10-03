const express = require('express');

const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authenticateUser } = require('../middleware/auth');
// Create an item
router.post('/items', authenticateUser, inventoryController.createItem);

// Get all items
router.get('/items', inventoryController.getAllItems);

// Get one item by ID
router.get(
  '/items/:id',
  authenticateUser,
  inventoryController.validateItem,
  inventoryController.getOneItem,
);

// Update an item by ID
router.put(
  '/items/:id',
  authenticateUser,
  inventoryController.validateItem,
  inventoryController.updateItem,
);

// Delete an item by ID
router.delete(
  '/items/:id',
  authenticateUser,
  inventoryController.validateItem,
  inventoryController.deleteItem,
);

module.exports = router;
