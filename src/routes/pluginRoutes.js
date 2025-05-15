const express = require('express');
const router = express.Router();
const Plugin = require('../models/Plugin');

// Get all plugins
router.get('/', async (req, res) => {
  try {
    const plugins = await Plugin.find();
    res.json(plugins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one plugin
router.get('/:id', async (req, res) => {
  try {
    const plugin = await Plugin.findById(req.params.id);
    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found' });
    }
    res.json(plugin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create plugin
router.post('/', async (req, res) => {
  const plugin = new Plugin({
    name: req.body.name,
    description: req.body.description,
    version: req.body.version,
    enabled: req.body.enabled,
  });

  try {
    const newPlugin = await plugin.save();
    res.status(201).json(newPlugin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update plugin
router.patch('/:id', async (req, res) => {
  try {
    const plugin = await Plugin.findById(req.params.id);
    if (!plugin) {
      return res.status(404).json({ message: 'Plugin not found' });
    }

    if (req.body.name) plugin.name = req.body.name;
    if (req.body.description) plugin.description = req.body.description;
    if (req.body.version) plugin.version = req.body.version;
    if (req.body.enabled !== undefined) plugin.enabled = req.body.enabled;

    const updatedPlugin = await plugin.save();
    res.json(updatedPlugin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete plugin
router.delete('/:id', async (req, res) => {
  try {
    const result = await Plugin.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Plugin not found' });
    }
    res.json({ message: 'Plugin deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 