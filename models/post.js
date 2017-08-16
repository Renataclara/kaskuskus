'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    name_post: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    TopicId: DataTypes.INTEGER
  });
  Post.associate = models => {
    Post.belongsTo(models.User);
    Post.belongsTo(models.Topic)
  }
  return Post;
};
