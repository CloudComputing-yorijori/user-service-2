const axios = require('axios');

async function sendToOtherService(data) {
  try {
    const response = await axios.post('https://httpbin.org/post', data);
    return response.data;
  } catch (err) {
    console.error('다른 서비스 호출 실패:', err.message);
    throw err;
  }
}

module.exports = { sendToOtherService };
