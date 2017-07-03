var express = require('express');
var router = express.Router();

//categories show
router.get('/show/:category',function(req, res, next){
	var db = req.db;
	var posts = db.get('posts');
	posts.find({category:req.params.category},{},function(err, posts){
		res.render('index',{
			title:req.params.category,
			posts:posts
		});
	});

});

// Adding categories
router.get('/add', function(req, res, next) {
	res.render('addcategory', { title: 'Add Category'});
});

router.post('/add', function(req, res, next){
	//get form values
	var db = req.db;
	var title = req.body.title;

	//Form Validation
	req.checkBody('title','Title field is required').notEmpty();

	//check errors
	var errors = req.validationErrors();
	if(errors){
		res.render('addcategory',{
			errors: errors,
			title: 'Add Category',
		});
	} else{
		var categories = db.get('categories');
		//submit to db
		categories.insert({
			title: title,
		}, function(err, post){
			if(err) res.send('There was an issue submitting category');
			req.flash('success','Category Submitted');
			res.location('/categories/add');
			res.redirect('/categories/add');
		});
	}
});

module.exports = router;
