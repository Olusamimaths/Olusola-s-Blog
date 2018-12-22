const express = require('express');
const mongo = require('mongodb')
var monk = require('monk');
var db =  monk('mongodb://admin:bestAdmin109@ds141924.mlab.com:41924/nodeblog'); 


var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({}, {sort : { date : -1 }}, function(err, posts){
		res.render('index', {title:'Olusola\'s Blog', posts, });
	});
});

module.exports = router;
