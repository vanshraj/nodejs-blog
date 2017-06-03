var express = require('express');
var router = express.Router();

// Home Page Blog Posts
router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');

	posts.find({},{},function(err,posts){
	res.render('index', { posts: posts });
	});
});

module.exports = router;
