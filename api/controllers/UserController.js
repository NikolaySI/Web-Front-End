/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	profile: function(req,res){
		// user username = 'taisan'
		// logged in user username
		if(req.session.me){
			var search_id = req.session.me.id;
			User.findOne({id:search_id})
			.populate('posts')
			.exec(function(err,user){
				if (err) return res.status(400).json(err);
				return res.status(200).view('profile',{user:user});
			})
		}else{
			return res.redirect('/auth?signinRequired=1');
		}
	},
	user: function(req,res){
		User.findOne({username:req.param('username')})
		.populate('posts')
		.exec(function(err,user){
			if (err) return res.status(400).json(err);
			return res.status(200).view('profile',{user:user});
		})
	},
	update: function(req,res){
		if(req.session.me){
			User.update({id:req.session.me.id},{
				public:req.param('public'),
				email:req.param('email'),
				password:req.param('pwd'),
				image:req.param('image')
			}).exec(function(err,status){
				if(err) return res.negotiate();
				return res.redirect('/');
			})
		}else{
			return res.redirect('/auth?signinRequired=1');
		}
	},
	login: function (req, res) {

    // See `api/responses/login.js`
    return res.login({
      email: req.param('log'),
      password: req.param('pwd'),
      successRedirect: '/',
      invalidRedirect: '/auth?invalidLogin=1'
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {

    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.me`.
    req.session.me = null;

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect('/auth?loggedOut=1');
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {

    // Attempt to signup a user using the provided parameters
    User.signup({
      username: req.param('log'),
      email: req.param('email'),
      password: req.param('pwd')
    }, function (err, user) {
      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.
      if (err) return res.negotiate(err);

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.me` set.
      req.session.me = user;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      if (req.wantsJSON) {
        return res.ok('ok');
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      return res.redirect('/profile');
    });
  }
};
