// const express = require('express');
// const router = express.Router();
// const {
//   getOpenedFundings,
//   getParticipatedFundings
// } = require('../utils/api');

// // 내 펀딩 정보 조회 API
// router.get('/myfundings/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const opened = await getOpenedFundings(userId);
//     const participated = await getParticipatedFundings(userId);

//     res.json({
//       openedFundings: opened,
//       participatedFundings: participated
//     });
//   } catch (error) {
//     console.error('펀딩 정보 가져오기 실패:', error.message);
//     res.status(500).json({ error: '펀딩 정보를 가져오는 데 실패했습니다.' });
//   }
// });

// module.exports = router;

