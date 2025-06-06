// const axios = require('axios');

// // 💬 예제용 외부 POST 요청 (테스트용)
// async function sendToOtherService(data) {
//   try {
//     const response = await axios.post('https://httpbin.org/post', data, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     return response.data;
//   } catch (err) {
//     console.error('다른 서비스 호출 실패:', err.message);
//     throw err;
//   }
// }

// // 📦 공동구매 서비스 연동
// const fundingServiceURL = 'http://localhost:8082'; // 실제 공동구매 서비스 주소로 변경

// async function getOpenedFundings(userId) {
//   try {
//     const response = await axios.get(`${fundingServiceURL}/funding/opened`, {
//       params: { user_id: userId }
//     });
//     return response.data;
//   } catch (err) {
//     console.error('오픈된 펀딩 조회 실패:', err.message);
//     throw err;
//   }
// }

// async function getParticipatedFundings(userId) {
//   try {
//     const response = await axios.get(`${fundingServiceURL}/funding/participated`, {
//       params: { user_id: userId }
//     });
//     return response.data;
//   } catch (err) {
//     console.error('참여한 펀딩 조회 실패:', err.message);
//     throw err;
//   }
// }

// module.exports = {
//   sendToOtherService,
//   getOpenedFundings,
//   getParticipatedFundings
// };

