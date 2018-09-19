'use strict';

const express = require('express');
const router = express.Router();
const Objectid = require('objectid');
const MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017/blog';

let dbName = 'blog';
let collectionName = 'cats';
//显示分类列表页面
router.get('/', function(req, res) {
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        if (err) throw err;
        let col = client.db(dbName).collection(collectionName);
        col.find().toArray((err,result) => {
            if (err) throw err;
            // console.log(result);
            res.render('admin/category_list',{cats:result})
        })
    })

});
//显示添加分类页面
router.get('/add',(req,res) => {
    res.render('admin/category_add')
});
//显示编辑分类页面
router.get('/edit',(req,res) => {
    let _id = req.query.id;
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        let col = client.db(dbName).collection(collectionName);
        col.findOne({_id:Objectid(_id)},(err,result) => {
            console.log(result);
            if (err) throw err;
            res.render('admin/category_edit',{cats:result})
        })
    });
});
//删除分类
router.get('/delete',(req,res,next) => {
    let _id = req.query.id;
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        let col = client.db(dbName).collection(collectionName);
        col.remove({_id:Objectid(_id)},(err,result) => {
            if (err){
                res.render('admin/message',{msg:'删除数据失败'})
            }else{
                res.render('admin/message',{msg:'删除数据成功'})
            }

        })
    })
});
//添加分类
router.post('/insert',(req,res) => {
    let title = req.body.title;
    let order = req.body.order;
    let cat= {
        title : title,
        order : order
    };
    // console.log(cat);
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        if (err) throw err;
        let col = client.db(dbName).collection(collectionName);
        col.insertOne(cat,(err,result) => {
            if (err) {
                res.render('admin/message',{msg:'添加分类失败！'})
            }else{
                res.render('admin/message',{msg:'添加分类成功！'})
            }
        });
    })

});
//更新分类
router.post('/update',(req,res) => {
    let title = req.body.title;
    let order = req.body.order;
    let _id = req.body._id;
    MongoClient.connect(url,{useNewUrlParser:true},(err,client) => {
        if (err) throw err;
        let col = client.db(dbName).collection(collectionName);
        col.update({_id:Objectid(_id)},{$set:{title:title,order:order}},(err,result) => {
            if (err){
                res.render('admin/message',{msg:"更新分类失败"})
            }else{
                res.render('admin/message',{msg:"更新分类成功"})
            }
        } )
    })
});

module.exports = router;