const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;


//GET /posts 所有用户或者特点用户的文章页
//   eg: GET /posts?author==xx
router.get('/',function(req,res,next){
    res.render('posts');
})

//POST /posts/create 发表一篇文章
router.post('/create',checkLogin,function(req,res,nex){
    res.send('发表文章');
})

//GET /posts/create 发表文章页
router.get('/create',checkLogin,function(req,res,next){
    res.send('发表文章页');
})

//GET /posts/:postId 单独一篇文章页
router.get('/:postId',function(res,req,next){
    res.send('文章详情页');
})

//GET /posts/:postId/edit 更新文章页
router.post('/:postId/edit',function(res,req,next){
    res.send('更新文章');
})

//GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove',checkLogin,function(res,req,next){
    res.send('删除文章');
})

module.exports  = router;