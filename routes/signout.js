const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

// GET /signout 登出
router.get('/',checkLogin,function(res,req,netx){
    //清空 session 中用户信息
    req.session.user = null;
    req.flash('success','登出成功');
    //登出成功之后跳转到主页
    res.redirect('/posts');
});

module.exports = router;