const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const myPageController = require('../controllers/myPageController');
const uploadprofile = require("../config/multerProfileConfig");

// 로그인 관련 라우트
router.get("/login", usersController.login);
router.post("/login", usersController.authenticate);

// 로그아웃 관련 라우트
router.get("/logout", usersController.logout, usersController.redirectView);

// 회원가입 관련 라우트
router.get("/newuser", usersController.new);
router.post("/newuser/create", usersController.create, usersController.redirectView);

// 회원정보 관련 라우트
router.get("/editpwd", usersController.editpwd);
router.post("/updatepwd", usersController.updatepwd, usersController.redirectView);
router.post("/:id/update", uploadprofile.single('profileImage'), usersController.update, usersController.redirectView);

// 마이페이지 관련 라우트
router.get("/mypage", myPageController.mypageMain);
router.get("/mypageScrap", myPageController.mypageScrap);
router.get("/mypageComment", myPageController.mypageComment);
router.get("/myPageMyFunding", myPageController.mypageMyFunding);
router.get("/mypageParticipatedFunding", myPageController.mypageParticipatedFunding);

module.exports = router;
