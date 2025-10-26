const express = require('express');
const { generateEmbeddings } = require('../utils/textProcessor');
const { searchVectorDB } = require('../utils/simpleVectorDB');
const { generateResponse } = require('../utils/geminiClient');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, domain, userId } = req.body;

    console.log('Chat request received:', { message, domain, userId });

    if (!message || !domain || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: message, domain, userId' 
      });
    }

    // Generate embedding for the user's query
    console.log('Generating query embedding...');
    const queryEmbedding = await generateEmbeddings([message]);
    console.log('Query embedding generated:', queryEmbedding[0].length, 'dimensions');
    
    // Search for relevant chunks in vector database
    console.log('Searching for relevant chunks...');
    const relevantChunks = await searchVectorDB({
      queryEmbedding: queryEmbedding[0],
      userId,
      domain,
      limit: 5
    });

    console.log('Found relevant chunks:', relevantChunks.length);

    if (!relevantChunks || relevantChunks.length === 0) {
      console.log('No relevant chunks found');
      return res.json({
        answer: "I couldn't find any relevant information in your uploaded documents to answer this question. Please make sure you have uploaded documents and try asking a different question.",
        sources: []
      });
    }

    // Prepare context from relevant chunks
    const context = relevantChunks.map(chunk => chunk.text).join('\n\n');
    const sources = relevantChunks.map(chunk => ({
      text: chunk.text.substring(0, 200) + '...',
      documentName: chunk.metadata.documentName,
      page: chunk.metadata.page || 'N/A'
    }));

    console.log('Context prepared:', context.substring(0, 200) + '...');
    console.log('Sources:', sources.length);

    // Generate response using Gemini API
    console.log('Generating AI response...');
    const answer = await generateResponse({
      query: message,
      context,
      domain,
      userId
    });

    console.log('AI response generated:', answer.substring(0, 100) + '...');

    res.json({
      answer,
      sources: sources.map(s => s.text),
      metadata: {
        chunksUsed: relevantChunks.length,
        domain
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      message: error.message 
    });
  }
});

module.exports = router;
