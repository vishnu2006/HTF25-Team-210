const express = require('express');
const { getDocumentsByUser, deleteDocument } = require('../utils/simpleVectorDB');

const router = express.Router();

// Get all documents for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { domain } = req.query;

    const documents = await getDocumentsByUser(userId, domain);
    
    res.json({
      success: true,
      documents
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch documents',
      message: error.message 
    });
  }
});

// Delete a document
router.delete('/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const success = await deleteDocument(documentId, userId);
    
    if (success) {
      res.json({ success: true, message: 'Document deleted successfully' });
    } else {
      res.status(404).json({ error: 'Document not found' });
    }

  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      error: 'Failed to delete document',
      message: error.message 
    });
  }
});

module.exports = router;
