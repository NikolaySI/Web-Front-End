/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    public: 'string',
    username: 'string',
    password: 'string',
    email: {
      type: 'string',
      contains: '@'
    },
    image: {
      type: 'string',
      defaultsTo: '/images/logo.png'
    },
    posts: {
      collection: 'post',
      via: 'author'
    }
  },

  signup: function (inputs, cb) {
    // Create a user
    User.create({
      username: inputs.username,
      public: inputs.username,
      email: inputs.email,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  },



  /**
   * Check validness of a login using the provided inputs.
   * But encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  attemptLogin: function (inputs, cb) {
    // Create a user
    User.findOne({
      username: inputs.username,
      // TODO: But encrypt the password first
      password: inputs.password
    })
    .exec(cb);
  }
};
