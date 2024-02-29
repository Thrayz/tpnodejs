const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const publicationSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});


const Publication = mongoose.model('Publication', publicationSchema);


const app = express();
app.use(express.json());

app.post('/publications', async (req, res) => {
  try {
    const { title, content } = req.body;
    const publication = new Publication({ title, content });
    await publication.save();
    res.status(201).json(publication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create publication' });
  }
});


app.get('/publications', async (req, res) => {
  try {
    const publications = await Publication.find();
    res.json(publications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get publications' });
  }
});


app.get('/publications/:id', async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.json(publication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get publication' });
  }
});


app.put('/publications/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const publication = await Publication.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.json(publication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update publication' });
  }
});


app.delete('/publications/:id', async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) return res.status(404).json({ error: 'Publication not found' });
    res.json({ message: 'Publication deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete publication' });
  }
});


const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));


