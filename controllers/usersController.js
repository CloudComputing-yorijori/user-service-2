const db = require("../models/index");
const User = db.user;
const passport = require("passport");
// const path = require("path");
// const upload = require("../config/multerConfig"); // Import the multer config


const getUserParams = body => ({
    name: body.name,
    email: body.email,
    password: body.password,
    nickname: body.nickname,
    phoneNumber: body.phoneNumber,
    city: body.city,
    district: body.district,
    town: body.town,
    detail: body.detail,
    imageUrl: body.imageUrl
});

module.exports = {

    //로그인 페이지 이동 
    login: (req, res) => {
        res.render("auth/login");
    },

    //회원가입 페이지 이동 
    new:(req, res) => {
        res.render("auth/newuser");
    },

    //로그인 진행 
    authenticate: passport.authenticate("local", {
        successRedirect: "/",
        successFlash: "로그인 성공",
        failureRedirect: "/auth/login",
        failureFlash: "로그인 실패"
    }),

    //로그아웃 진행 
    logout: (req, res, next) => {
        req.logout((err) => {
            req.flash("success", "로그아웃 되었습니다.");
            res.redirect("/");
        });
    },

    //다시 할게 무엇인지 
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined) res.redirect(redirectPath);
        else next();
    },

    //회원가입 진행 
    create: (req, res, next) => {
        const { password, PwdCheck } = req.body;

        if (password !== PwdCheck) {
            req.flash("error", "비밀번호가 일치하지 않습니다."); // Passwords do not match
            return res.redirect("/auth/newuser");
        }

        if (req.skip) next();
        let userParams = getUserParams(req.body);
        
        User.register(new User(userParams), req.body.password, (error, user) => {
            if (user) {
                req.flash("success", `${user.name}님 회원가입 되었습니다.`);
                res.redirect("/auth/login");
            } else {
                console.log(`Error saving user: ${error.message}`);
                req.flash("error", `회원가입 실패: ${error.message}`);
                res.redirect("/auth/newuser");
            }
        });
    },

    //비밀변경 페이지 이동 
    editpwd:(req, res) => {
        res.render("auth/editpwd");
    },

    //비밀번호 변경 
    updatepwd: async (req, res, next) => {
        const { email, newPwd, newPwdCheck } = req.body;
    
        if (newPwd !== newPwdCheck) {
            req.flash("error", "비밀번호가 일치하지 않습니다."); // Passwords do not match
            return res.redirect("/auth/editpwd");
        }
    
        try {
            let user = await User.findOne({ where: { email } });
            if (user) {
                user.setPassword(newPwd, async (err) => {
                    if (err) {
                        console.log(`Error updating password: ${err.message}`);
                        req.flash("error", "비밀번호 변경 실패하였습니다.");
                        res.redirect("/auth/editpwd");
                    } else {
                        await user.save();
                        req.flash("success", "비밀번호가 변경되었습니다.");
                        res.redirect("/auth/login");
                    }
                });
            } else {
                req.flash("error", "유저를 찾을 수 없습니다.");
                res.redirect("/auth/editpwd");
            }
        } catch (error) {
            console.log(`Error updating password: ${error.message}`);
            req.flash("error", "비밀번호 변경 실패하였습니다.");
            res.redirect("/auth/editpwd");
        }
    },    

    //정보 수정 
    edit: async(req, res, next) => {
        let userId = req.params.id;
        try{
            let user = await User.findByPk(userId);
            res.render("auth/edit", {
                user: user
            });
        }
        catch(error){
            console.log(`Error fetching user by ID: ${error.message}`);
            req.flash("error", "정보수정에 실패하였습니다.");
            res.redirect("/");
        }
    },

    //정보 수정 진행(닉네임, 상세주소, 프로필)
    update: async (req, res, next) => {
        let userId = req.params.id;
        let userParams = getUserParams(req.body);

        if (req.file) {
            userParams.imageUrl = '/uploadprofile/' + req.file.filename; // 파일 경로를 imageUrl에 저장
        }

        try {
            let user = await User.findByPk(userId);

            if (user) {
                await user.update(userParams);
                req.flash("success", "정보가 수정되었습니다.");
                res.redirect(`/auth/mypage`);
            } else {
                req.flash("error", "User not found.");
                res.redirect("/");
            }
        } catch (error) {
            console.log(`Error updating user by ID: ${error.message}`);
            req.flash("error", "정보수정에 실패하였습니다..");
            res.redirect("/");
        }
    }
};
