var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads' });

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