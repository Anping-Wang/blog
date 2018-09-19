'use strict';
const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const Objectid = require('objectid');
let dbName = 'blog';
let collectionName = 'articles';
let url = "mongodb://localhost:27017/blog";

//显示文章列表页面
router.get('/',(req,res,next) => {
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        let col = client.db(dbName).collection(collectionName);
        col.find().toArray( (err,result) => {
            if (err) throw err;
            res.render('admin/article_list',{articles:result})
        })
    })
});
//显示添加文章页面
router.get('/add',(req,res,next) => {
    //查询分类数据
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        let col = client.db(dbName).collection('cats');
        col.find().toArray( (err,result) => {
            console.log(result);
            if (err) throw err;
            res.render('admin/article_add',{cats:result})
        })
    })
});
//显示编辑文章页面
router.get('/edit',(req,res,next) => {
    let _id = req.query.id;
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        if (err) throw err;
        let col = client.db(dbName).collection(collectionName);
        col.findOne({_id:Objectid(_id)},(err,result) => {
            if (err) throw err;
            let cat = client.db(dbName).collection('cats');
            cat.find().toArray((err,result2) => {
                if (err) throw err;
                res.render('admin/article_edit',{article : result,cats : result2})
            })
        })
    })
});
//添加文章
router.post('/insert',(req,res) => {
    let cat = req.body.cat;
    let title = req.body.title;
    let summary = req.body.summary;
    let content = req.body.content;
    console.log(cat);
    let article = {
        cat : cat,
        title : title,
        summary : summary,
        content : content,
        time : new Date().toLocaleString(),
        count : Math.ceil( Math.random() * 100)
    };
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        let col = client.db(dbName).collection(collectionName);
        col.insertOne(article,(err,result) => {
            if(err){
                res.render('admin/message',{msg:'文章添加失败'})
            }else{
                res.render('admin/message',{msg:'文章添加成功'})
            }
        })
    })
});

//更新文章
router.post('/update',(req,res) => {
    let cat = req.body.cat;
    let title = req.body.title;
    let summary = req.body.summary;
    let content = req.body.content;
    let _id = req.body._id;
    let time = new Date().toLocaleString();
    let count = Math.ceil(Math.random() * 100);
    // let article = {
    //     cat : cat,
    //     title : title,
    //     summary : summary,
    //     content : content,
    //     time : new Date().toLocaleString(),
    //     count : Math.ceil( Math.random() * 100)
    // };
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        if (err) throw err;
        let col = client.db(dbName).collection(collectionName);
        col.update({_id:Objectid(_id)},{$set:{title:title,summary:summary,content:content,cat:cat,time:time,count:count}},(err,result) => {
            if (err){
                res.render('admin/message',{msg:'更新文章失败'})
            }else{
                res.render('admin/message',{msg:'更新文章成功'})
            }
        })
    })
});

//删除文章
router.get('/delete',(req,res) => {
    let _id = req.query.id;
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        if (err) throw err;
        let col = client.db(dbName).collection(collectionName);
        col.remove({_id:Objectid(_id)},(err,result) => {
            if (err) {
                res.render('admin/message',{msg:'删除文章失败'})
            }else {
                res.render('admin/message',{msg:'删除文章成功'})
            }
        })
    })
});
module.exports = router;