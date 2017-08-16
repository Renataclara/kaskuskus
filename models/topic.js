'use strict';
module.exports = function(sequelize, DataTypes) {
  var Topic = sequelize.define('Topic', {
    name_topic: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  });
  Topic.associate = models => {
      Topic.belongsTo(models.User);
      Topic.belongsToMany(models.User, {through: 'Post'})
  }
  return Topic;
};
