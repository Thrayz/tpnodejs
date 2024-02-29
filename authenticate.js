const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});


const User = mongoose.model('User', userSchema);


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


const app = express();


app.use(express.json());


app.post('/register', async (req, res) => {
  try {
   
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'secret-key');

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

