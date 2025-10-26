const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Simple in-memory vector database for development
let vectorStore = {};

// Load existing data
const dataFile = path.join(__dirname, '../data/vectorStore.json');
if (fs.existsSync(dataFile)) {
  try {
    vectorStore = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (error) {
    console.log('Creating new vector store');
    vectorStore = {};
  }
}

// Save data to file
function saveData() {
  const dataDir = path.dirname(dataFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dataFile, JSON.stringify(vectorStore, null, 2));
}

// Collection names for different users and domains
function getCollectionName(userId, domain) {
  return `user_${userId}_${domain}`;
}

async function storeInVectorDB({ userId, fileName, domain, chunks, embeddings, metadata }) {
  try {
    const collectionName = getCollectionName(userId, domain);
    
    console.log(`Storing document: ${fileName} in collection: ${collectionName}`);
    console.log(`Chunks: ${chunks.length}, Embeddings: ${embeddings.length}`);
    
    if (!vectorStore[collectionName]) {
      vectorStore[collectionName] = [];
    }

    // Store each chunk with its embedding
    const documentId = uuidv4();
    chunks.forEach((chunk, index) => {
      const chunkId = `${documentId}_${index}`;
      const chunkData = {
        id: chunkId,
        documentId,
        documentName: fileName,
        text: chunk,
        embedding: embeddings[index],
        metadata: {
          ...metadata,
          chunkIndex: index,
          domain,
          userId,
          uploadDate: new Date().toISOString()
        }
      };
      vectorStore[collectionName].push(chunkData);
      console.log(`Stored chunk ${index + 1}/${chunks.length}: ${chunk.substring(0, 50)}...`);
    });

    saveData();
    console.log(`Successfully stored document ${fileName} with ${chunks.length} chunks`);
    return documentId;
  } catch (error) {
    console.error('Error storing in vector DB:', error);
    throw new Error('Failed to store document in vector database');
  }
}

// Simple cosine similarity calculation
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function searchVectorDB({ queryEmbedding, userId, domain, limit = 5 }) {
  try {
    const collectionName = getCollectionName(userId, domain);
    
    console.log(`Searching in collection: ${collectionName}`);
    console.log(`Query embedding length: ${queryEmbedding.length}`);
    
    if (!vectorStore[collectionName] || vectorStore[collectionName].length === 0) {
      console.log('No documents found in collection');
      return [];
    }

    console.log(`Found ${vectorStore[collectionName].length} chunks in collection`);

    // Calculate similarities
    const similarities = vectorStore[collectionName].map(item => {
      const similarity = cosineSimilarity(queryEmbedding, item.embedding);
      return {
        ...item,
        similarity
      };
    });

    // Sort by similarity and return top results
    const results = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => ({
        text: item.text,
        metadata: item.metadata,
        similarity: item.similarity
      }));

    console.log(`Found ${results.length} relevant chunks`);
    results.forEach((result, index) => {
      console.log(`Result ${index + 1}: similarity=${result.similarity.toFixed(4)}, text="${result.text.substring(0, 100)}..."`);
    });

    return results;
  } catch (error) {
    console.error('Error searching vector DB:', error);
    return [];
  }
}

async function getDocumentsByUser(userId, domain = null) {
  try {
    if (domain) {
      const collectionName = getCollectionName(userId, domain);
      const documents = {};
      
      if (vectorStore[collectionName]) {
        vectorStore[collectionName].forEach(item => {
          const docName = item.documentName;
          if (!documents[docName]) {
            documents[docName] = {
              id: item.documentId,
              name: item.documentName,
              uploadDate: item.metadata.uploadDate,
              domain: item.metadata.domain,
              chunksCount: 0
            };
          }
          documents[docName].chunksCount++;
        });
      }
      
      return Object.values(documents);
    } else {
      // Get all domains for user
      const domains = ['educational', 'legal', 'healthcare', 'business', 'general'];
      const allDocuments = [];
      
      for (const domainName of domains) {
        const collectionName = getCollectionName(userId, domainName);
        const documents = {};
        
        if (vectorStore[collectionName]) {
          vectorStore[collectionName].forEach(item => {
            const docName = item.documentName;
            if (!documents[docName]) {
              documents[docName] = {
                id: item.documentId,
                name: item.documentName,
                uploadDate: item.metadata.uploadDate,
                domain: item.metadata.domain,
                chunksCount: 0
              };
            }
            documents[docName].chunksCount++;
          });
        }
        
        allDocuments.push(...Object.values(documents));
      }
      
      return allDocuments;
    }
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
}

async function deleteDocument(documentId, userId) {
  try {
    // Find and remove all chunks for this document
    for (const collectionName in vectorStore) {
      if (collectionName.includes(`user_${userId}_`)) {
        vectorStore[collectionName] = vectorStore[collectionName].filter(
          item => item.documentId !== documentId
        );
      }
    }
    
    saveData();
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

module.exports = {
  storeInVectorDB,
  searchVectorDB,
  getDocumentsByUser,
  deleteDocument
};
