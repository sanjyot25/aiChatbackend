const express = require('express');
const router = express.Router();
const Model = require('../models/Model');
const Plugin = require('../models/Plugin');

// Process chat message
router.post('/', async (req, res) => {
  try {
    const { modelId, pluginIds, message } = req.body;

    // Validate required fields
    if (!modelId || !message) {
      return res.status(400).json({ message: 'Model ID and message are required' });
    }

    // Get the model
    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    // Check if model is active
    if (model.status !== 'active') {
      return res.status(400).json({ message: 'Selected model is not active' });
    }

    // Get plugins if specified
    let plugins = [];
    if (pluginIds && pluginIds.length > 0) {
      plugins = await Plugin.find({
        _id: { $in: pluginIds },
        enabled: true
      });
      
      // Check if all requested plugins were found and enabled
      if (plugins.length !== pluginIds.length) {
        return res.status(400).json({ 
          message: 'One or more plugins are not available or not enabled' 
        });
      }
    }

    // In a real implementation, we would call the actual AI API here
    // For this mock, we'll create a simulated response
    const response = {
      id: Date.now().toString(),
      modelName: model.name,
      plugins: plugins.map(p => p.name),
      message: generateMockResponse(message, model.name, plugins),
      timestamp: new Date()
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper function to generate mock responses
function generateMockResponse(message, modelName, plugins) {
  const pluginInfo = plugins.length > 0 
    ? `I'm using these plugins: ${plugins.map(p => p.name).join(', ')}.\n` 
    : '';
  
  return `Hello! I'm a simulated response from ${modelName}.\n${pluginInfo}You said: "${message}"\n\nHere's my mock response based on your input. In a real implementation, this would be an actual AI response from the model's API endpoint.`;
}

module.exports = router; 