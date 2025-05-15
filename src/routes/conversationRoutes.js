const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Model = require('../models/Model');

// Get all conversations
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .populate('modelId', 'name')
      .populate('pluginIds', 'name');
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one conversation with its messages
router.get('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('modelId', 'name description')
      .populate('pluginIds', 'name description');
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    const messages = await Message.find({ conversationId: req.params.id })
      .sort({ timestamp: 1 });
    
    res.json({
      conversation,
      messages
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new conversation
router.post('/', async (req, res) => {
  try {
    const { modelId, pluginIds, title } = req.body;
    
    // Validate model exists
    const model = await Model.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    const conversation = new Conversation({
      title: title || 'New Conversation',
      modelId,
      pluginIds: pluginIds || [],
    });
    
    const newConversation = await conversation.save();
    
    res.status(201).json(newConversation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update conversation
router.patch('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    if (req.body.title) conversation.title = req.body.title;
    if (req.body.modelId) conversation.modelId = req.body.modelId;
    if (req.body.pluginIds) conversation.pluginIds = req.body.pluginIds;
    if (req.body.isActive !== undefined) conversation.isActive = req.body.isActive;
    
    const updatedConversation = await conversation.save();
    res.json(updatedConversation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete conversation and its messages
router.delete('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId: req.params.id });
    
    // Delete the conversation
    await Conversation.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Conversation and messages deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 