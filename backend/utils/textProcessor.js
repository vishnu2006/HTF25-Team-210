const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function chunkText(text, chunkSize = 500, overlap = 100) {
  const words = text.split(' ');
  const chunks = [];
  
  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }
  }
  
  return chunks;
}

async function generateEmbeddings(texts) {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const embeddings = [];
    
    console.log(`Generating embeddings for ${texts.length} texts`);
    
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      try {
        console.log(`Embedding text ${i + 1}/${texts.length}: ${text.substring(0, 100)}...`);
        const result = await model.embedContent(text);
        embeddings.push(result.embedding.values);
        console.log(`Successfully embedded text ${i + 1}`);
      } catch (embedError) {
        console.error('Error embedding text:', embedError);
        // Create a dummy embedding for now
        const dummyEmbedding = new Array(768).fill(0).map(() => Math.random() - 0.5);
        embeddings.push(dummyEmbedding);
      }
    }
    
    console.log(`Generated ${embeddings.length} embeddings`);
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    // Return dummy embeddings if all else fails
    return texts.map(() => new Array(768).fill(0).map(() => Math.random() - 0.5));
  }
}

module.exports = {
  chunkText,
  generateEmbeddings
};
