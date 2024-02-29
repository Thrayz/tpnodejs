const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));


const voitureSchema = new mongoose.Schema({
  name: String
});

const Voiture = mongoose.model('Voiture', voitureSchema);


app.get('/', async (req, res) => {
  try {
    const voitures = await Voiture.find();
    res.json(voitures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const voiture = await Voiture.findById(req.params.id);
    if (voiture) {
      res.json(voiture);
    } else {
      console.log('Voiture does not exist');
      res.status(404).json({ message: 'Voiture not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/create', async (req, res) => {
  try {
    const { name } = req.body;
    const voiture = new Voiture({ name });
    await voiture.save();
    res.status(201).json(voiture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const voiture = await Voiture.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (voiture) {
      res.json(voiture);
    } else {
      console.log('Voiture not found');
      res.status(404).json({ message: 'Voiture not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/:id', async (req, res) => {
  try {
    const voiture = await Voiture.findByIdAndDelete(req.params.id);
    if (voiture) {
      res.json(voiture);
    } else {
      console.log('Voiture not found');
      res.status(404).json({ message: 'Voiture not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


