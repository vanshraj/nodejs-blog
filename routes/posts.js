var express = require('express');
var router = express.Router();
var multer = require('multer');
var ObjectId = require('mongodb').ObjectID;
var upload = multer({ dest: './public/images/uploads' });

router.get('/show/:id',function(req, res, next){
	var db = req.db;
	var posts = db.get('posts');
	posts.findOne({_id:ObjectId(req.params.id)}, function(err, post){
		res.render('show',{
			post:post
		});
	});
});

router.get('/add',function(req, res, next){
	var db = req.db;
	var categories = db.get('categories');
	categories.find({},{},function( err, categories){
			res.render('addpost',{
			title: "Add Posts",
			categories: categories
		});
	});
});

router.post('/addcomment', function(req, res, next){
	//get form values
	var db = req.db;
	var name = req.body.name;
	var email = req.body.email;
	var body = req.body.body;
	var postid = req.body.postid;
	var commentdate = new Date();

	//Form Validation
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('body','Body field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email is not formatted correctly').isEmail();

	//check errors
	var errors = req.validationErrors();
	if(errors){
		var posts = db.get('posts');
		posts.findOne({"_id":ObjectId(postid)},function(err, post){
			res.render('show',{
				errors:errors,
				post:post
			});
		});
	} else{
		var comment = {name: name, email: email, body: body, commentdate: commentdate}
		var posts = db.get('posts');
		//submit to db
		posts.update({
			_id: postid
		},
		{
			$push:{
				comments: comment
			}
		},function(err, doc){
			if(err) throw err;
			else{
				req.flash('success','Comment Added');
				res.location('/posts/show/'+postid);
				res.redirect('/posts/show/'+postid);
			}
		});
	}
});

router.post('/add', upload.single('mainimage'), function(req, res, next){
	//get form values
	var db = req.db;
	var title = req.body.title;
	var category = req.body.category;
	var body = req.body.body;
	var author = req.body.author;
	var date = new Date();

	if(req.file){
		var mainImageOriginalName = req.file.originalname;
		var mainImageName = req.file.filename;
		console.log(mainImageName + " Uploaded");
		var mainImageMime = req.file.mimetype;
		var mainImagePath = req.file.path;
		var mainImageExt = req.file.extension;
		var mainImageSize = req.file.size;
	} else {
		var mainImageName = 'noimage.png'
	}

	//Form Validation
	req.checkBody('title','Title field is required').notEmpty();
	req.checkBody('body','Body field is required').notEmpty();

	//check errors
	var errors = req.validationErrors();
	if(errors){
		var categories = db.get('categories');

		categories.find({},{},function( err, categories){
			res.render('addpost',{
				errors: errors,
				title: "Add Posts",
				categories: categories
			});
		});		
	} else{
		var posts = db.get('posts');
		//submit to db
		posts.insert({
			title: title,
			body: body,
			category: category,
			author: author,
			date: date,
			mainimage: mainImageName
		}, function(err, post){
			if(err) res.send('There was an issue submitting post');
			req.flash('success','Post Submitted');
			res.location('/');
			res.redirect('/');
		});
	}
});
module.exports = router;