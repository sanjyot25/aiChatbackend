const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const Model = require('../models/Model');
const Plugin = require('../models/Plugin');

// Get all messages for a conversation
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new message and get AI response
router.post('/', async (req, res) => {
  try {
    const { conversationId, content, role } = req.body;
    
    // Validate required fields
    if (!conversationId || !content || !role) {
      return res.status(400).json({ 
        message: 'Conversation ID, content, and role are required' 
      });
    }
    
    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Update conversation timestamp
    conversation.updatedAt = Date.now();
    await conversation.save();
    
    // Create and save user message
    const userMessage = new Message({
      conversationId,
      content,
      role,
      timestamp: Date.now()
    });
    
    const savedUserMessage = await userMessage.save();
    
    // If this is a user message, generate an AI response
    if (role === 'user') {
      // Get model info
      const model = await Model.findById(conversation.modelId);
      if (!model) {
        return res.status(404).json({ message: 'Model not found' });
      }
      
      // Get plugins if specified
      let plugins = [];
      if (conversation.pluginIds && conversation.pluginIds.length > 0) {
        plugins = await Plugin.find({
          _id: { $in: conversation.pluginIds },
          enabled: true
        });
      }
      
      // Generate mock AI response for now
      // In a real application, call the actual AI API here
      const responseContent = generateMockResponse(
        content, 
        model.name, 
        plugins
      );
      
      // Create and save assistant message
      const assistantMessage = new Message({
        conversationId,
        content: responseContent,
        role: 'assistant',
        timestamp: Date.now(),
        metadata: {
          model: model.name,
          plugins: plugins.map(p => p.name)
        }
      });
      
      const savedAssistantMessage = await assistantMessage.save();
      
      // Return both messages
      res.status(201).json({
        userMessage: savedUserMessage,
        assistantMessage: savedAssistantMessage
      });
    } else {
      // If it's not a user message, just return the saved message
      res.status(201).json(savedUserMessage);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
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