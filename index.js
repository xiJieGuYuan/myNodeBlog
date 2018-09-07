const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite')(__dirname);
const routes = require('./routes');
const pkg = require('./package');

const app = express();

//设置模板目录
app.set('views',path.join(__dirname,'views'));

//设置模板引擎为ejs
app.set('view engine','ejs');

//设置静态文件目录
app.use(express.static(path.join(__dirname,'public')));

//session 中间件
app.use(session({
    name:config.session.key,//设置cookie 中保存session id的字段名称
    secret:config.session.secret,//通过设置secret来计算hash值并凡在cookie中,使产生的 signedCookie放篡改
    resave:true,//强制更新session
    saveUninitialized: false,//设置为false,强制创建一个session,即时用户未登录
    cookie:{
        maxAge:config.session.maxAge,//过期时间,过期后cookie中的session id自动删除
    },
    store:new MongoStore({//将session 存储到mongodb
        url:config.mongodb//mongodb 地址
    })
}));

//flash 中间件,用来显示通知
app.use(flash());

//设置模板全局变量
app.locals.blog={
    title:pkg.name,
    descripiton:pkg.descripiton
};
//添加模板必需的三个变量
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    res.locals.sucess = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

//处理表单及文件上传中间件
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'),
    keepExtensions:true//保留后缀
}))

//路由
routes(app);

//监听端口,启动程序
app.listen(config.port,()=>{
    console.log(`${pkg.name} listening on port ${config.port}`);
});

//注意：中间件的加载顺序很重要。如上面设置静态文件目录的中间件应该放到 routes(app) 之前加载，
//这样静态文件的请求就不会落到业务逻辑的路由里；
//flash 中间件应该放到 session 中间件之后加载，因为 flash 是基于 session 实现的。