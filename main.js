const express = require("express"),
    app = express();
layouts = require("express-ejs-layouts"),
    db = require("./models/index"),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    flash = require("connect-flash"),
    passport = require("passport"),
    fs = require('fs'),
    FileStore = require('session-file-store')(session);

    db.sequelize.sync({});
const User = db.user;
const axios = require('axios');

multer = require('multer'),
multerGoogleStorage = require('multer-google-storage'),
cors = require('cors');

app.use(cors({
  origin: ['https://yorijori.com'],
  credentials: true
}));
    
//bodyParser 추가
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//파일 업로드를 위한 multer 설정
const upload = multer({
    storage: multerGoogleStorage.storageEngine({
        bucket: 'yorizori_post_img',
        projectId: 'burnished-core-422015-g1',
        keyFilename: 'secure/burnished-core-422015-g1-f3b170868aa8.json',
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한 (예: 5MB)
});

//프로필 이미지 업로드를 위한 multer 설정 
const path = require('path');

//const uploadprofile = require('./config/multerProfileConfig');

// `uploadprofile` 디렉토리가 존재하지 않으면 생성합니다.
const uploadDir = path.join(__dirname, 'uploadprofile');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 정적 파일 제공 설정
app.use('/uploadprofile', express.static(path.join(__dirname, 'uploadprofile')));

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.use(layouts);

app.use(flash());

// Redis 관련 모듈 추가
const Redis = require("redis");
const { RedisStore } = require("connect-redis");

// Redis 클라이언트 생성
const redisClient = Redis.createClient({
    legacyMode: true, // Redis v4를 사용하는 경우, connect-redis 호환을 위해 legacy 모드 설정
    url: "redis://redis:6379", // 실제 Redis 서버 컨테이너와 일치해야 됨
  });
  redisClient.connect().catch(console.error);
  
 
// 세션 설정 (RedisStore 사용)
app.use(
  session({
      name: 'connect.sid', // 유저 서비스와 동일한 이름
      store: new RedisStore({ client: redisClient }),
      secret: "yorijori_secret_key",
      resave: false,
      saveUninitialized: false,
      cookie: {
          secure: false,  
          httpOnly: true,  // JS 접근 차단 (보안)
          maxAge: 1000 * 60 * 60 * 24,
          sameSite: 'lax', 
          domain: ".yorijori.com" // 도메인 일치
      }
  })
);
//플래시 메시지 미들웨어 설정
// app.use(flash());

// 전역 변수 설정 (플래시 메시지를 모든 템플릿에서 사용할 수 있도록 설정)
// app.use((req, res, next) => {
//     res.locals.successMessages = req.flash('success');
//     res.locals.errorMessages = req.flash('error');
//     next();
// });

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    console.log(res.locals.flashMessages);
    next();
});


// 모든 요청 전에 실행되는 미들웨어
app.use((req, res, next) => {
    res.locals.showCategoryBar = false; // 기본적으로 카테고리 바를 표시하지 않음
    res.locals.showSubCategoryBar = false; // 기본적으로 세부 카테고리 바를 표시하지 않음
    next();
});

app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use("/css", express.static(path.join(__dirname, "public/css")));

const authRouter = require("./routers/authRouter");
// 로그인 및 사용자 관리 접근
app.use("/auth", authRouter);

// const testRouter = require('./routers/testRouter');
// app.use('/api', testRouter);

// const imageRouter = require('./routers/imageRouter');
// app.use('/image', imageRouter);

// const fundingRouter = require('./routers/fundingRouter');
// app.use('/funding', fundingRouter);



//플래시 메시지 미들웨어 설정
// app.use(flash());

// app.set('view engine', 'ejs');

// 라우터 설정
// app.use('/auth', authRouter);

// 서버 실행
app.set("port", 3000);
app.listen(app.get("port"), "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${app.get("port")}`);
});

module.exports = app;
