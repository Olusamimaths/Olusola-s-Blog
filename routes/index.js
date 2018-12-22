const express = require('express');
const mongo = require('mongodb')
const monk = require('monk');
const db =  monk('mongodb://admin:bestAdmin109@ds141924.mlab.com:41924/nodeblog'); 


const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	let posts = db.get('posts');
	posts.find({}, {sort : { date : -1 }}, function(err, posts){
		res.render('index', {title:'Olusola\'s Blog', posts, });
	});
});

module.exports = router;
