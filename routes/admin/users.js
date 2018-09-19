var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/blog';

router.get('/', function(req, res, next) {
  if(req.session.isLogin){
      res.render('admin')
  } else {
      res.redirect('/user/login')
  }

});

router.get('/login', function(req, res, next) {
    res.render('admin/login')
});

router.get('/logout',(req,res,next) => {
    req.session.destroy();
    res.redirect('/user/login');
});


router.post('/signin',(req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        let col = client.db('blog').collection('user');
        col.find({username:username,password:password},(err,result) => {
            if (err) throw err;
            if(result){
                req.session.isLogin = 1;
                res.redirect('/admin');
            }else {
                res.render('admin/login')
            }
        })
    })
});

module.exports = router;
