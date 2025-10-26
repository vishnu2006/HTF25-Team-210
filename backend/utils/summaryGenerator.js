const { generateSummary } = require('./geminiClient');

async function generateDocumentSummary(text, domain) {
  try {
    return await generateSummary(text, domain);
  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Summary not available';
  }
}

module.exports = {
  generateDocumentSummary
};
