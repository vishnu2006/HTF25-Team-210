const { ChromaClient } = require('chromadb');
const { v4: uuidv4 } = require('uuid');

// Initialize ChromaDB client
const client = new ChromaClient({
  path: process.env.CHROMA_URL || "http://localhost:8000"
});

// Collection names for different users and domains
function getCollectionName(userId, domain) {
  return `user_${userId}_${domain}`;
}

async function storeInVectorDB({ userId, fileName, domain, chunks, embeddings, metadata }) {
  try {
    const collectionName = getCollectionName(userId, domain);
    
    // Create or get collection
    let collection;
    try {
      collection = await client.getCollection({ name: collectionName });
    } catch (error) {
      collection = await client.createCollection({ 
        name: collectionName,
        metadata: { domain, userId }
      });
    }

    // Prepare data for storage
    const ids = chunks.map((_, index) => `${uuidv4()}_${index}`);
    const metadatas = chunks.map((chunk, index) => ({
      ...metadata,
      chunkIndex: index,
      documentName: fileName,
      text: chunk.substring(0, 100) + '...' // Store preview
    }));

    // Store in vector database
    await collection.add({
      ids,
      embeddings,
      documents: chunks,
      metadatas
    });

    return ids[0]; // Return document ID
  } catch (error) {
    console.error('Error storing in vector DB:', error);
    throw new Error('Failed to store document in vector database');
  }
}

async function searchVectorDB({ queryEmbedding, userId, domain, limit = 5 }) {
  try {
    const collectionName = getCollectionName(userId, domain);
    
    const collection = await client.getCollection({ name: collectionName });
    
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: limit
    });

    if (!results.documents || results.documents[0].length === 0) {
      return [];
    }

    // Format results
    const formattedResults = results.documents[0].map((doc, index) => ({
      text: doc,
      metadata: results.metadatas[0][index],
      distance: results.distances[0][index]
    }));

    return formattedResults;
  } catch (error) {
    console.error('Error searching vector DB:', error);
    return [];
  }
}

async function getDocumentsByUser(userId, domain = null) {
  try {
    if (domain) {
      const collectionName = getCollectionName(userId, domain);
      const collection = await client.getCollection({ name: collectionName });
      const results = await collection.get();
      
      // Group by document
      const documents = {};
      results.metadatas.forEach((metadata, index) => {
        const docName = metadata.documentName;
        if (!documents[docName]) {
          documents[docName] = {
            id: metadata.documentName,
            name: metadata.documentName,
            uploadDate: metadata.uploadDate,
            domain: metadata.domain,
            chunksCount: 0
          };
        }
        documents[docName].chunksCount++;
      });

      return Object.values(documents);
    } else {
      // Get all domains for user
      const domains = ['educational', 'legal', 'healthcare', 'business', 'general'];
      const allDocuments = [];
      
      for (const domainName of domains) {
        try {
          const collectionName = getCollectionName(userId, domainName);
          const collection = await client.getCollection({ name: collectionName });
          const results = await collection.get();
          
          // Group by document
          const documents = {};
          results.metadatas.forEach((metadata, index) => {
            const docName = metadata.documentName;
            if (!documents[docName]) {
              documents[docName] = {
                id: metadata.documentName,
                name: metadata.documentName,
                uploadDate: metadata.uploadDate,
                domain: metadata.domain,
                chunksCount: 0
              };
            }
            documents[docName].chunksCount++;
          });

          allDocuments.push(...Object.values(documents));
        } catch (error) {
          // Collection doesn't exist for this domain, skip
          continue;
        }
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
    // This is a simplified implementation
    // In a real scenario, you'd need to track document IDs properly
    console.log(`Deleting document ${documentId} for user ${userId}`);
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
