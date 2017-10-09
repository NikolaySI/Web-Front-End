/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create:function(req,res){
		if(req.session.me){
			var post_id = req.param('post_id');
			Comment.create({
				'content':req.param('comment'),
				'post':post_id,
				'author':req.session.me.id
			}).exec(function(err,comment){
				if(err) return res.negotiate();
				Post.findOne({id:post_id}).exec(function(err,post){
					return res.redirect('/post/'+post.uri+'#comment-'+comment.id);
				})
			});
		}else{
			res.redirect('/auth?signinRequired=1')
		}
	},
	delete:function(req,res){
		if(req.session.me){
			var comment_id = req.param('comment_id');
			var post_id = req.param('post_id');
			var search = {
				id:comment_id,
				author:req.session.me.id,
				post:post_id
			}
			Post.findOne({id:post_id}).exec(function(err,post){
				Comment.findOne(search).exec(function(err,comment){
					if(err) return res.negotiate();
					if(comment){
						Comment.destroy(search).exec(function(err){
							if(err) return res.negotiate();
							res.redirect('/post/'+post.uri+'?deletedComment=1');
						})
					}else{
						return res.redirect('/post/'+post.uri+'?cantDeleteComment=1#comment-'+comment_id);
					}
				})
			})
		}else{
			res.redirect('/auth?signinRequired=1');
		}
	}

};
