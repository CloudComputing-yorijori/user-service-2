const db = require("../models/index"),
    sequelize = db.sequelize,
    Sequelize = db.Sequelize;
const axios = require('axios');

module.exports = {
    //마이페이지 메인(게시글 보기)
    mypageMain: async (req, res) => {
        try {
            let userId = res.locals.currentUser.getDataValue('userId');

            let query = `
                SELECT p.postId, p.title, p.userId, i.imageUrl
                FROM posts p
                LEFT JOIN users u ON u.userId = p.userId
                LEFT JOIN images i ON p.postId = i.postId
                WHERE u.userId = ${userId};
            `;
            let [myposts, metadata] = await sequelize.query(query, { type: Sequelize.SELECT });
            console.log("Query Results:", myposts);

            let postsMap = {};
            myposts.forEach(post => {
                if (!postsMap[post.postId]) {
                    postsMap[post.postId] = {
                        title: post.title,
                        postId: post.postId,
                        userId: post.userId,
                        images: []
                    };
                }
                postsMap[post.postId].images.push(post.imageUrl);
            });

            let postsArray = Object.values(postsMap);

            let query2 = `
                SELECT nickname, imageUrl
                FROM users
                WHERE userId = ${userId};     
            `;
            let [results, metadata2] = await sequelize.query(query2, { type: Sequelize.SELECT });
            console.log(results);

		// 이미지 서비스에서 실제 이미지 URL 요청
		const imageId = results[0]?.imageUrl;
		results[0].imageUrl = imageId
  		 ? await module.exports.getImageUrl(imageId)
		 : "/default/profile.png";



            res.render("auth/mypage_main", { posts: postsArray, result: results[0], userId: userId });
        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },

    //마이페이지(스크랩 보기)
    mypageScrap: async (req, res) => {
        try {
            //내가 저장한 게시글 목록 불러오기 
            let userId = res.locals.currentUser.getDataValue('userId');
            let query = `
                SELECT p.title, p.date, p.postId
                FROM saves s
                LEFT join posts p on s.postId = p.postId
                where s.userId = ${userId};   
            `;
            let [myposts, metadata] = await sequelize.query(query, { type: Sequelize.SELECT });

             // 날짜 출력 조정 
             myposts.forEach(post => {
                const date = new Date(post.date);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                post.date = date.toLocaleDateString('en-US', options);
            });

            //팝업에 닉네임이랑 프로필 뜨게 
            let query2 = `
                 SELECT nickname, imageUrl
                 FROM users
                 where userId = ${userId};     
            `;
            let [results, metadata2] = await sequelize.query(query2, { type: Sequelize.SELECT });

            console.log("Query Results:", myposts); // 쿼리 결과를 콘솔에 출력

		// 이미지 서비스에서 실제 이미지 URL 요청
                const imageId = results[0]?.imageUrl;
                results[0].imageUrl = imageId
                 ? await module.exports.getImageUrl(imageId)
                 : "/default/profile.png";

            res.render("auth/mypage_scrap", { posts: myposts, result:results[0], userId:userId }); // 결과를 사용하여 페이지 렌더링
        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
        
        
    },

    //마이페이지(댓글 보기)
    mypageComment: async (req, res) => {
        try {
            //내가 단 댓글 목록 불러오기 
            let userId = res.locals.currentUser.getDataValue('userId');
            let query = `
                        SELECT p.title, c.content, c.createdAt, p.postId  
                        FROM comments c
                        left join posts p on p.postId= c.postId
                        where c.userId =${userId};
            `;
            let [myposts, metadata] = await sequelize.query(query, { type: Sequelize.SELECT });

             // 날짜 출력 조정
             myposts.forEach(post => {
                const date = new Date(post.createdAt);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                post.createdAt = date.toLocaleDateString('en-US', options);
            });

            //팝업에 닉네임이랑 프로필 뜨게 
            let query2 = `
                 SELECT nickname, imageUrl
                 FROM users
                 where userId = ${userId};     
            `;
            let [results, metadata2] = await sequelize.query(query2, { type: Sequelize.SELECT });


            console.log("Query Results:", myposts); // 쿼리 결과를 콘솔에 출력

		// 이미지 서비스에서 실제 이미지 URL 요청
                const imageId = results[0]?.imageUrl;
                results[0].imageUrl = imageId
                 ? await module.exports.getImageUrl(imageId)
                 : "/default/profile.png";


            res.render("auth/mypage_comment", { posts: myposts, result:results[0], userId:userId }); // 결과를 사용하여 페이지 렌더링
        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },

    // 마이페이지(개최한 펀딩 보기)
mypageMyFunding: async (req, res) => {
    try {
        let userId = res.locals.currentUser.getDataValue('userId');

        const response = await axios.get("http://funding-service:3001/funding/opened", {
            headers: {
              Cookie: req.headers.cookie
            },
            timeout: 5000 // 5초 안에 응답 없으면 오류 발생
          });
        
          console.log("응답 도착:", response.status, response.data);
          let myposts = response.data;
        

        // 날짜 출력 조정 
        myposts.forEach(post => {
            const date = new Date(post.fundingDate);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            post.fundingDate = date.toLocaleDateString('en-US', options);
        });

        // 팝업에 닉네임이랑 프로필 뜨게 
        let query2 = `
             SELECT nickname, imageUrl
             FROM users
             WHERE userId = ${userId};
        `;
        let [results] = await sequelize.query(query2, { type: Sequelize.SELECT });

        console.log("Query Results:", myposts);

		// 이미지 서비스에서 실제 이미지 URL 요청
                const imageId = results[0]?.imageUrl;
                results[0].imageUrl = imageId
                 ? await module.exports.getImageUrl(imageId)
                 : "/default/profile.png";


        res.render("auth/mypage_myfunding", {
            posts: myposts,
            result: results[0],
            userId: userId
        });
    } catch (axiosError) {
        console.error("Axios 에러:", axiosError.code, axiosError.message);
        if (axiosError.response) {
          console.error("응답 상태:", axiosError.response.status);
          console.error("응답 내용:", axiosError.response.data);
        }
      }
    // } catch (error) {
    //     res.status(500).send({ message: error.message });
    //     console.error(`Error: ${error.message}`);
    // }
},

    //마이페이지(참여한 펀딩보기)
    mypageParticipatedFunding: async (req, res) => {
        try {
            //참여한 펀딩 불러오기 
            let userId = res.locals.currentUser.getDataValue('userId');
            
            // 공동구매 서비스에 요청
            const response = await axios.get("http://funding-service:3001/funding/participated", {
                headers: {
                    Cookie: req.headers.cookie
                }
            });


            let myposts = response.data;

                // 날짜 출력 조정
            myposts.forEach(post => {
                const date = new Date(post.fundingGroup.fundingDate);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                post.fundingGroup.fundingDate = date.toLocaleDateString('en-US', options);
            });

            //팝업에 닉네임이랑 프로필 뜨게 
            let query2 = `
                 SELECT nickname, imageUrl
                 FROM users
                 where userId = ${userId};     
            `;
            let [results, metadata2] = await sequelize.query(query2, { type: Sequelize.SELECT });


            console.log("Query Results:", myposts); // 쿼리 결과를 콘솔에 출력

		// 이미지 서비스에서 실제 이미지 URL 요청
                const imageId = results[0]?.imageUrl;
                results[0].imageUrl = imageId
                 ? await module.exports.getImageUrl(imageId)
                 : "/default/profile.png";


            res.render("auth/mypage_participatedfunding", { posts: myposts, result:results[0], userId:userId }); // 결과를 사용하여 페이지 렌더링
        } catch (error) {
            res.status(500).send({ message: error.message });
            console.error(`Error: ${error.message}`);
        }
    },

	    // 마이페이지(커뮤니티 글/댓글/스크랩 보기)
    mypageCommunity: async (req, res) => {
        try {
            let userId = res.locals.currentUser.getDataValue('userId');

            const [postsRes, commentsRes, scrapsRes] = await Promise.all([
                axios.get(`http://community.yorijori.com/community/user/${userId}/posts`, {
                    headers: { Host: 'community.yorijori.com', Cookie: req.headers.cookie }
                }),
                axios.get(`http://community.yorijori.com/community/user/${userId}/comments`, {
                    headers: { Host: 'community.yorijori.com', Cookie: req.headers.cookie }
                }),
                axios.get(`http://community.yorijori.com/community/user/${userId}/scraps`, {
                    headers: { Host: 'community.yorijori.com', Cookie: req.headers.cookie }
                })
            ]);

            const [results] = await sequelize.query(
                `SELECT nickname, imageUrl FROM users WHERE userId = ${userId};`,
                { type: Sequelize.SELECT }
            );
		// 이미지 서비스에서 실제 이미지 URL 요청
                const imageId = results[0]?.imageUrl;
                results[0].imageUrl = imageId
                 ? await module.exports.getImageUrl(imageId)
                 : "/default/profile.png";


            res.render("auth/mypage_community", {
                posts: postsRes.data,
                comments: commentsRes.data,
                scraps: scrapsRes.data,
                result: results[0],
                userId
            });
        } catch (error) {
            console.error("커뮤니티 연동 에러:", error.message);
            req.flash("error", "커뮤니티 정보 로딩 실패");
            res.redirect("/auth/mypage");
        }
    },
	
	//프로필 이미지 로딩
	getImageUrl: async (imageId) => {
  try {
    const response = await axios.get(`http://image-service:3001/${imageId}`);
    return response.data.data.url;  //  imageService 응답 구조에 맞게 수정필요
  } catch (error) {
    console.error(`이미지 로딩 실패: ${error.message}`);
    return '/default/profile.png';
  }
}


};

