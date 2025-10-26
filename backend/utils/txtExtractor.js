async function extractTextFromTxt(buffer) {
  try {
    return buffer.toString('utf-8');
  } catch (error) {
    console.error('Error extracting TXT text:', error);
    throw new Error('Failed to extract text from TXT file');
  }
}

module.exports = {
  extractTextFromTxt
};
