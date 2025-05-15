const express = require('express');
const router = express.Router();
const Model = require('../models/Model');

// Get all models
router.get('/', async (req, res) => {
  try {
    const models = await Model.find();
    res.json(models);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one model
router.get('/:id', async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.json(model);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create model
router.post('/', async (req, res) => {
  const model = new Model({
    name: req.body.name,
    description: req.body.description,
    apiEndpoint: req.body.apiEndpoint,
    status: req.body.status,
  });

  try {
    const newModel = await model.save();
    res.status(201).json(newModel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update model
router.patch('/:id', async (req, res) => {
  try {
    const model = await Model.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    if (req.body.name) model.name = req.body.name;
    if (req.body.description) model.description = req.body.description;
    if (req.body.apiEndpoint) model.apiEndpoint = req.body.apiEndpoint;
    if (req.body.status) model.status = req.body.status;

    const updatedModel = await model.save();
    res.json(updatedModel);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete model
router.delete('/:id', async (req, res) => {
  try {
    const result = await Model.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Model not found' });
    }
    res.json({ message: 'Model deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 