module.exports = {
  index: function(req,res){
    Post.find()
    .populate('author')
    .populate('comments')
    .sort('updatedAt DESC')
    .limit(12)
    .exec(function(err,posts){
      if (err) return res.status(400).json(err);
      var data = {
        posts:posts
      };
      res.status(200).view('index',data);
    })
  },
  contact_us: function(req, res){
    res.status(200).view('contact_us',{});
  }
};
