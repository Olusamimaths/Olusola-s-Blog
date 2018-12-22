function addComment(req, res, next) {
    const { name }   = req.body;
    const { email } = req.body;
    const { body } = req.body;
    const postslug = req.body.postslug;
    const date = new Date();

    // Check file upload 
    if(req.file) {
        var mainImage = req.file.filename;
    } else {
        var mainImage = 'noimage.jpg';
    }

    // form validation
    req.checkBody('name', 'name field is required').notEmpty();   
    req.checkBody('email','Email field is required but never displayed').notEmpty();
    req.checkBody('email', 'Email not valid').isEmail(); 
    req.checkBody('body', 'Slug field is required').notEmpty();

    // check errors
    const errors = req.validationErrors();
    if(errors) {
        let posts = db.get('posts');
        posts.find({slug: postslug},{},function(err, posts){
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
}

module.exports = addComment