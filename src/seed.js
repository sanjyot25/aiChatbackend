const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Model = require('./models/Model');
const Plugin = require('./models/Plugin');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

dotenv.config();

// Sample models data
const models = [
  {
    name: 'GPT-3.5',
    description: 'A fast and efficient model for most tasks, optimized for chat',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    status: 'active'
  },
  {
    name: 'GPT-4',
    description: 'Advanced capabilities for complex tasks, longer context, and better reasoning',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    status: 'active'
  },
  {
    name: 'Claude 2',
    description: 'Anthropic\'s advanced AI assistant with strong conversational abilities',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    status: 'active'
  },
  {
    name: 'Llama 2',
    description: 'Meta\'s open-source large language model',
    apiEndpoint: 'https://api.meta.com/llama/v1/chat',
    status: 'inactive'
  }
];

// Sample plugins data
const plugins = [
  {
    name: 'Web Search',
    description: 'Search the web for real-time information',
    version: '1.0.0',
    enabled: true
  },
  {
    name: 'Code Interpreter',
    description: 'Run and execute code in various programming languages',
    version: '1.2.1',
    enabled: true
  },
  {
    name: 'Image Generation',
    description: 'Generate images from text descriptions',
    version: '0.9.5',
    enabled: true
  },
  {
    name: 'File Reader',
    description: 'Read and analyze different file formats',
    version: '1.1.0',
    enabled: false
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/typing-mind-clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Model.deleteMany({});
    await Plugin.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    const insertedModels = await Model.insertMany(models);
    const insertedPlugins = await Plugin.insertMany(plugins);
    
    // Create sample conversations with model and plugin references
    const gpt3Model = insertedModels.find(m => m.name === 'GPT-3.5');
    const gpt4Model = insertedModels.find(m => m.name === 'GPT-4');
    const claudeModel = insertedModels.find(m => m.name === 'Claude 2');
    
    const webSearchPlugin = insertedPlugins.find(p => p.name === 'Web Search');
    const codePlugin = insertedPlugins.find(p => p.name === 'Code Interpreter');
    const imagePlugin = insertedPlugins.find(p => p.name === 'Image Generation');
    
    const conversations = [
      {
        title: 'Learning about AI',
        modelId: gpt3Model._id,
        pluginIds: [],
        createdAt: new Date(Date.now() - 3600000 * 48), // 48 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 48)
      },
      {
        title: 'Coding a React App',
        modelId: gpt4Model._id,
        pluginIds: [codePlugin._id],
        createdAt: new Date(Date.now() - 3600000 * 24), // 24 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 24)
      },
      {
        title: 'Research Project',
        modelId: claudeModel._id,
        pluginIds: [webSearchPlugin._id, imagePlugin._id],
        createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 2)
      }
    ];
    
    const insertedConversations = await Conversation.insertMany(conversations);
    
    // Create sample messages
    const learningConversation = insertedConversations.find(c => c.title === 'Learning about AI');
    const codingConversation = insertedConversations.find(c => c.title === 'Coding a React App');
    const researchConversation = insertedConversations.find(c => c.title === 'Research Project');
    
    const messages = [
      // Learning about AI conversation
      {
        conversationId: learningConversation._id,
        content: 'What are the different types of artificial intelligence?',
        role: 'user',
        timestamp: new Date(learningConversation.createdAt.getTime() + 1000)
      },
      {
        conversationId: learningConversation._id,
        content: 'Artificial Intelligence can be categorized in several ways:\n\n1. **Narrow AI (Weak AI)**: Systems designed for a specific task (e.g., virtual assistants, recommendation systems).\n\n2. **General AI (Strong AI)**: Systems with human-like intelligence across different domains (still theoretical).\n\n3. **Supervised Learning**: Algorithms trained on labeled data.\n\n4. **Unsupervised Learning**: Algorithms that find patterns in unlabeled data.\n\n5. **Reinforcement Learning**: Algorithms that learn through trial and error.\n\n6. **Machine Learning**: AI systems that improve through experience.\n\n7. **Deep Learning**: Neural network-based AI with multiple layers.\n\n8. **Expert Systems**: Rule-based systems for specific domains.\n\nWhich of these would you like to learn more about?',
        role: 'assistant',
        timestamp: new Date(learningConversation.createdAt.getTime() + 15000),
        metadata: {
          model: 'GPT-3.5',
          plugins: []
        }
      },
      
      // Coding conversation
      {
        conversationId: codingConversation._id,
        content: 'How do I create a todo list app in React?',
        role: 'user',
        timestamp: new Date(codingConversation.createdAt.getTime() + 1000)
      },
      {
        conversationId: codingConversation._id,
        content: "Here's how to create a basic Todo List app in React:\n\n```jsx\nimport React, { useState } from 'react';\n\nfunction TodoApp() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState('');\n\n  const addTodo = () => {\n    if (input.trim() !== '') {\n      setTodos([...todos, { text: input, completed: false, id: Date.now() }]);\n      setInput('');\n    }\n  };\n\n  const toggleTodo = (id) => {\n    setTodos(\n      todos.map(todo =>\n        todo.id === id ? { ...todo, completed: !todo.completed } : todo\n      )\n    );\n  };\n\n  const deleteTodo = (id) => {\n    setTodos(todos.filter(todo => todo.id !== id));\n  };\n\n  return (\n    <div className=\"todo-app\">\n      <h1>Todo List</h1>\n      <div className=\"add-todo\">\n        <input\n          value={input}\n          onChange={(e) => setInput(e.target.value)}\n          onKeyPress={(e) => e.key === 'Enter' && addTodo()}\n          placeholder=\"Add a new task\"\n        />\n        <button onClick={addTodo}>Add</button>\n      </div>\n      <ul className=\"todo-list\">\n        {todos.map(todo => (\n          <li key={todo.id} className={todo.completed ? 'completed' : ''}>\n            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>\n            <button onClick={() => deleteTodo(todo.id)}>Delete</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default TodoApp;\n```\n\nTo use this component, you would import it in your `App.js` file. You might also want to add some CSS to style the todo list. Let me know if you'd like me to provide that as well!",
        role: 'assistant',
        timestamp: new Date(codingConversation.createdAt.getTime() + 20000),
        metadata: {
          model: 'GPT-4',
          plugins: ['Code Interpreter']
        }
      },
      
      // Research conversation
      {
        conversationId: researchConversation._id,
        content: 'What are the latest developments in renewable energy?',
        role: 'user',
        timestamp: new Date(researchConversation.createdAt.getTime() + 1000)
      },
      {
        conversationId: researchConversation._id,
        content: "Based on recent research, here are some of the latest developments in renewable energy:\n\n1. **Perovskite Solar Cells**: Efficiency improvements reaching over 25%, approaching traditional silicon cells while being cheaper to produce.\n\n2. **Green Hydrogen**: Increased investment in electrolysis powered by renewable sources to produce carbon-free hydrogen fuel.\n\n3. **Floating Offshore Wind**: New installations of floating wind turbines allowing wind farms in deeper waters with stronger winds.\n\n4. **Long-Duration Energy Storage**: Beyond lithium-ion batteries, new technologies like flow batteries, compressed air, and thermal storage are advancing to store renewable energy for days or weeks.\n\n5. **Agrivoltaics**: Combining solar panels with agricultural land use, improving land efficiency while maintaining crop production.\n\n6. **Solid-State Batteries**: Progress toward commercially viable solid-state batteries that could revolutionize both renewable energy storage and electric vehicles.\n\n7. **AI Grid Management**: Artificial intelligence systems optimizing electricity distribution from variable renewable sources.\n\nWould you like me to expand on any of these specific technologies?",
        role: 'assistant',
        timestamp: new Date(researchConversation.createdAt.getTime() + 25000),
        metadata: {
          model: 'Claude 2',
          plugins: ['Web Search', 'Image Generation']
        }
      }
    ];
    
    await Message.insertMany(messages);
    
    console.log('Database seeded successfully!');
    console.log(`Inserted: 
      - ${insertedModels.length} models
      - ${insertedPlugins.length} plugins
      - ${insertedConversations.length} conversations
      - ${messages.length} messages`);
    
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 