const express = require('express');
const router = express.Router();
const monk = require('monk');
const db =  monk('mongodb://admin:bestAdmin109@ds141924.mlab.com:41924/nodeblog'); 


/* POST post listing. */
router.post('/add', function(req, res, next) {
    const { name }   = req.body;
    const { slug } = req.body;
    const date = new Date();

    // form validation
    req.checkBody('name', 'name field is required').notEmpty();   
    req.checkBody('slug', 'Slug field is required').notEmpty();

    // check errors
    const errors = req.validationErrors();
    if(errors) {
        res.render('addCategory', {title: 'Add Category', errors,})
    } else {
        let posts = db.get('categories');
        posts.insert({
            name,
            slug,
            date
        }, function(err, post){
            if(err) {
                console.log(err)
                res.send(err)
            } else {
                req.flash('success', 'Category Added');
                res.location('/');
                res.redirect('/');
            }

        })
    }
});

/* GET category listing. */
router.get('/add', function(req, res, next) {
	res.render('addCategory', {
        title: 'Add Category'
    } )
});

/* GET specific Category listing. */
router.get('/show/:category', function(req, res, next) {
	var posts = db.get('posts');
	posts.find({category: req.params.category},{},function(err, posts){
		res.render('index',{
  			'title': `Posts in ${req.params.category}`,
            posts,
  		});
	});
});

module.exports = router;
