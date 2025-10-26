const express = require('express');
const multer = require('multer');
const { extractTextFromPDF } = require('../utils/pdfExtractor');
const { extractTextFromDocx } = require('../utils/docxExtractor');
const { extractTextFromTxt } = require('../utils/txtExtractor');
const { chunkText, generateEmbeddings } = require('../utils/textProcessor');
const { storeInVectorDB } = require('../utils/simpleVectorDB');
const { generateSummary } = require('../utils/geminiClient');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are allowed.'));
    }
  }
});

router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const { domain, userId } = req.body;
    const files = req.files;

    console.log('Upload request received:', { domain, userId, fileCount: files?.length });

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];

    for (const file of files) {
      try {
        let text = '';
        
        // Extract text based on file type
        if (file.mimetype === 'application/pdf') {
          text = await extractTextFromPDF(file.buffer);
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          text = await extractTextFromDocx(file.buffer);
        } else if (file.mimetype === 'text/plain') {
          text = await extractTextFromTxt(file.buffer);
        }

        if (!text || text.trim().length === 0) {
          throw new Error('No text content found in file');
        }

        // Clean and preprocess text
        const cleanedText = text.replace(/\s+/g, ' ').trim();
        
        // Chunk the text
        const chunks = chunkText(cleanedText, 500, 100);
        
        // Generate embeddings for each chunk
        const embeddings = await generateEmbeddings(chunks);
        
        // Store in vector database
        const documentId = await storeInVectorDB({
          userId,
          fileName: file.originalname,
          domain,
          chunks,
          embeddings,
          metadata: {
            fileSize: file.size,
            uploadDate: new Date().toISOString(),
            mimeType: file.mimetype
          }
        });

        // Generate summary
        const summary = await generateSummary(cleanedText, domain);

        results.push({
          fileName: file.originalname,
          documentId,
          summary,
          chunksCount: chunks.length,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        results.push({
          fileName: file.originalname,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      results,
      message: `${results.filter(r => r.status === 'success').length} documents processed successfully`
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      message: error.message 
    });
  }
});

module.exports = router;
