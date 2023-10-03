const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

// Function to create a new user
exports.createUser = (req, res) => {
  const { username } = req.body;
  const role = 'user';
  // Check if the username already exists
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Generate a unique API key
  const apiKey = uuidv4();

  // Add the new user to the users array with the generated API key
  users.push({ username, role, apiKey });

  // Save the updated user data to users.json
  fs.writeFileSync('users.json', JSON.stringify(users), 'utf-8');
  // Return the generated API key to the user
  res.status(201).json({ message: 'User created successfully', apiKey });
};
