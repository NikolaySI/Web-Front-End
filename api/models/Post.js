/**
 * Post.js
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
    title: 'string',
    content: 'text',
    category: 'string',
    image: 'string',
    author: {
      model: 'user'
    },
    uri: {
      type:'string',
      unique: true
    },
    comments: {
      collection: 'comment',
      via: 'post'
    }
  }
};
