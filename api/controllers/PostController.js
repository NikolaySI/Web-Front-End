/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var nestedPop = require('nested-pop');

module.exports = {
	single : function(req,res){
		Post
		.findOne({'uri':req.param('uri')})
		.populate('author')
		.populate('comments')
		.exec(function(err,post){
			if (err) return res.status(400).json(err);
			if(post){
				return nestedPop(post, {
	        comments: [
	          'author'
	        ]
		    }).then(function(post) {
					var data = {
						post : post
					};
					return res.status(200).view('single',data);
		    }).catch(function(err) {
	        return res.status(400).json(err);
		    });
			}else{
				res.notFound();
			}
		})
	},
	create: function(req,res){
		if(req.session.me){
			return res.status(200).view('post-form');
		}else{
			return res.redirect('/auth?signinRequired=1');
		}
	},
	do_create: function(req,res){
		if(req.session.me){
			Post.create({
				title:req.param('title'),
				image:req.param('image'),
				content:req.param('content'),
				category:req.param('category'),
				uri:req.param('uri'),
				author:req.session.me.id
			}).exec(function(err,post){
				if(err) return res.status(500).json(err);
				return res.redirect('/post/'+post.uri+'?newpost=1');
			});
		}else{
			return res.notFound()
		}
	},
	edit: function(req,res){
		var id = req.param('id');
		if(req.session.me){
			Post.findOne({id:id})
			.populate('author')
			.exec(function(err,post){
				if(post && req.session.me && req.session.me.id === post.author.id){
					res.status(200).view('edit-post-form',{post:post});
				}
				if(post){
					//no access
					return res.forbidden();
				}
				return res.notFound();
			});
		}else{
			return res.redirect('/auth?signinRequired=1');
		}
	},
	do_edit: function(req,res){
		var id = req.param('id');
		if(req.session.me){
			Post.update({id:id},{
				title:req.param('title'),
				image:req.param('image'),
				content:req.param('content'),
				category:req.param('category'),
				uri:req.param('uri')
			}).exec(function(err,post){
				if(err) return res.status(500).json(err);
				return res.redirect('/post/'+req.param('uri')+'?updatedpost=1');
			})
		}else{
			return res.notFound();
		}
	},
	fill : function(req, res){
		sails.log.debug("Filling DB with users/posts/comments");
		//dummy user
		User.create({
			public: 'taisan',
			username: 'taisan',
			password: '123654',
			email: 'taisan@localhost.me'
		}).exec(function(err,user,c){
			var AUTHOR = user.id;
			sails.log.debug('Created taisan!');
			Post.create({
				content:'test post',
				image: '',
				title: 'Testing',
				category: 'blog',
				uri: 'test-post',
				author: user.id
			}).exec(function(err,post){
				sails.log.debug('Taisan crated a post');
				Comment.create({
					post:post,
					author:user.id,
					content: 'test comment'
				}).exec(function(err,comment){
					sails.log.debug('Taisan comented a post');
					User.findOne({'username':'taisan'}).populate('posts').exec(function(err,user){
						if (err) return res.status(400).json(err);
						res.status(201).json(user);
					});
				})
			})
		})
	}
};
