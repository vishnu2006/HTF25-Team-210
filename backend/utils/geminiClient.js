const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBnFn9dnDyLBEH2kO6ObDWne0-QD5MQsbA");

// Domain-specific prompt templates
const domainPrompts = {
  educational: `You are an educational AI assistant. Your role is to help students and learners understand complex topics by:
- Simplifying explanations and breaking down complex concepts
- Defining technical terms clearly
- Providing step-by-step explanations
- Encouraging learning and understanding

Use the provided document context to answer questions accurately and help the user learn. If the answer is not in the context, say "I couldn't find that information in the document, but I'd be happy to help you understand related concepts."`,

  legal: `You are a legal AI assistant. Your role is to provide information based strictly on the provided legal documents:
- Base your answers ONLY on the document text provided
- Avoid making assumptions or interpretations beyond what's explicitly stated
- Clearly indicate when information is not available in the document
- Do not provide legal advice, only information from the documents

Use the provided document context to answer questions. If the answer is not in the context, say "I couldn't find that information in the provided legal documents."`,

  healthcare: `You are a healthcare AI assistant. Your role is to provide informational insights based on medical documents:
- Provide information based on the document content
- Include appropriate disclaimers about medical information
- Emphasize that this is for informational purposes only
- Recommend consulting healthcare professionals for medical decisions

Use the provided document context to answer questions. If the answer is not in the context, say "I couldn't find that information in the provided medical documents. Please consult with a healthcare professional for medical advice."`,

  business: `You are a business AI assistant. Your role is to extract insights and provide business-focused analysis:
- Extract key insights, trends, and summaries from business documents
- Focus on actionable information and business implications
- Identify patterns and important data points
- Provide strategic insights where appropriate

Use the provided document context to answer questions. If the answer is not in the context, say "I couldn't find that information in the provided business documents."`,

  general: `You are a helpful AI assistant. Your role is to provide accurate and helpful information based on the provided documents:
- Answer questions based on the document content
- Be conversational and helpful
- Provide clear and concise responses
- Cite relevant information from the documents

Use the provided document context to answer questions. If the answer is not in the context, say "I couldn't find that information in the provided documents."`
};

async function generateResponse({ query, context, domain, userId }) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an AI assistant specialized in the ${domain} field.
Use the provided document context to answer the question accurately and concisely.
If the answer is not in the context, say "I couldn't find that information in the document."

Context:
${context}

Question:
${query}

Answer:`;

    console.log('Sending prompt to Gemini:', prompt.substring(0, 200) + '...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const answer = response.text();
    console.log('Gemini response:', answer.substring(0, 100) + '...');
    
    return answer;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate AI response');
  }
}

async function generateSummary(text, domain) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `Please provide a brief summary (2-3 sentences) of the following document for a ${domain} context:

${text.substring(0, 2000)}...`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Summary not available';
  }
}

module.exports = {
  generateResponse,
  generateSummary
};
