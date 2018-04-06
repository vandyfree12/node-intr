//Staff model.
'use strict';

var Sequelize = require('sequelize'),
    bcrypt = require('bcrypt'),
    config = require('../config'),
    db = require('./database');

// 1: The model schema.
var modelDefinition = {
  firstName: { type: Sequelize.STRING},
  lastName: { type: Sequelize.STRING},
  middleName: { type: Sequelize.STRING},
  email:{ type: Sequelize.STRING, unique: true, allowNull: false },
  username: { type: Sequelize.STRING, unique: true, allowNull: false },
  mobile:{ type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false},
  gravatar: { type: Sequelize.BLOB('long') },
  bio: { type: Sequelize.TEXT },
  position: { type: Sequelize.STRING},
  department: { type: Sequelize.STRING},
  status: {type: Sequelize.BOOLEAN, defaultValue: true },
  following: { type: Sequelize.STRING },
  like:{ type: Sequelize.STRING },
  group: { type: Sequelize.STRING},
  role: {
    type: Sequelize.STRING,
    defaultValue: config.userRoles.user
  },
  joined: { type: Sequelize.DATE },
  otherInfo: { type: Sequelize.STRING},
  email_confirmed: { type: Sequelize.BOOLEAN },
  mobile_confirmed: { type: Sequelize.BOOLEAN},
  secret: { type: Sequelize.STRING},
  blocked: {
    type: Sequelize.STRING,
    defaultValue: 'active'
  }

};

// 2: The model options.
var modelOptions = {
  instanceMethods: {
    comparePasswords: comparePasswords
  },
  hooks: {
    beforeValidate: hashPassword
  },
  classMethods:{
    associate: associate
  }
};


// 3: Define the User model.
var UserModel = db.define('user', modelDefinition, modelOptions);

// Compares two passwords.
function comparePasswords(password, callback) {
  bcrypt.compare(password, this.password, function(error, isMatch) {
    if(error) {
      return callback(error);
    }
    return callback(null, isMatch);
  });
}

// Hashes the password for a user object.
function hashPassword(user) {
  if(user.changed('password')) {
    return bcrypt.hash(user.password, 10).then(function(password) {
      user.password = password;
    });
  }
}

function associate(models) {
  //A User can have many Makes.
  UserModel.hasMany(models.MakeModel, {
    onDelete: 'cascade'
  });
}

module.exports = UserModel;
