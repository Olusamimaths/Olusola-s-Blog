const express = require('express');
const router = express.Router();
const monk = require('monk');
const db =  monk('mongodb://admin:bestAdmin109@ds141924.mlab.com:41924/nodeblog'); 
const multer = require('multer');
const upload = multer({dest: './public/images'})


/* POST post listing. */
router.post('/add', upload.single('mainImage'), function(req, res, next) {
    const { title }   = req.body;
    const { category } = req.body;
    const { body } = req.body;
    const { author } = req.body;
    const { slug } = req.body;
    const date = new Date();

    
    // Check file upload 
    if(req.file) {
        var mainImage = req.file.filename;
    } else {
        var mainImage = 'noimage.jpg';
    }

    // form validation
    req.checkBody('title', 'Title field is required').notEmpty();   
    req.checkBody('body', 'Body field is required').notEmpty();
    req.checkBody('slug', 'Slug field is required').notEmpty();

    // check errors
    const errors = req.validationErrors();
    if(errors) {
        let categories = db.get('categories');
        categories.find({}, {}, function (err, categories) {
            res.render('addPost', {
                title: 'Add Post',
                categories,
                errors,
            });
	})
    } else {
        let posts = db.get('posts');
        posts.insert({
            title, 
            body, 
            category, 
            date,
            author,
            slug,
            mainImage
        }, function(err, post){
            if(err) {
                console.log(err)
                res.send(err)
            } else {
                req.flash('success', 'Post Added');
                res.location('/');
                res.redirect('/');
            }

        })
    }
});

/* GET post listing. */
router.get('/add', function(req, res, next) {
	let categories = db.get('categories');
	categories.find({},{},function(err, categories){
		res.render('addpost',{
  			'title': 'Add Post',
  			'categories': categories
  		});
	})
});

/* GET specific pos */
router.get('/show/:slug', function(req, res, next) {
	let posts = db.get('posts');
	posts.find({slug: req.params.slug},{},function(err, posts){
		res.render('singlePost',{
  			'title': `Posts in ${req.params.slug}`,
            posts,
  		});
	});
});

// COMMENT SECTION
/* POST post listing. */
router.post('/addComment', function(req, res, next) {
    const { name }   = req.body;
    const { email } = req.body;
    const { body } = req.body;
    const postslug = req.body.postslug;
    const date = new Date();

    // form validation
    req.checkBody('name', 'name field is required').notEmpty();   
    req.checkBody('email','Email field is required but never displayed').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail(); 
    req.checkBody('body', 'Slug field is required').notEmpty();

    // check errors
    const errors = req.validationErrors();
    if(errors) {
        let posts = db.get('posts');
        posts.find({slug: postslug},{}, function(err, posts){
            res.render('singlePost',{
                  errors,
                posts,
              });
        });
    } else {
        let comment = {
            name, 
            email,
            body,
            date
        }

        let posts = db.get('posts');

        // update post to add comment
        posts.update({
            slug: postslug
        }, {$push: {
                'comments': comment
        }}, function(err, doc){
            if(err) {
                throw err;
            } else {
                req.flash('success', 'Comment Added');
                res.location(`/posts/show/${postslug}`);
                res.redirect(`/posts/show/${postslug}`);
            }

        })
    }
});


module.exports = router;
