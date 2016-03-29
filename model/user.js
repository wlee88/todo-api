var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');
var jwtPass = 'qwerty123';
var cryptPass = 'abc123';

module.exports = function(sequelize, DataTypes) {
  var user =  sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    password_hash: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.VIRTUAL,
      allowNull:false,
      validate: {
        len:[7,100]
      },
      set: function(value) {
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword);
      }
    }
  ,
  }, {
    instanceMethods: {
      toPublicJSON: function() {
        var json = this.toJSON();
        return _.pick(json, 'id','email', 'createdAt', 'updatedAt');
      },
      generateToken: function(type) {
        if(!_.isString(type)) {
          return undefined;
        }
        try {
          var stringData = JSON.stringify({
            id: this.get('id'),
            type: type
          });
          var encryptedData = cryptojs.AES.encrypt(stringData, cryptPass).toString();
          var token = jwt.sign({
            token: encryptedData
          }, jwtPass//jwt pass
          );
          return token;
        } catch(e) {
          return undefined;
        }
      }
    },
    classMethods: {
      authenticate: function(body) {
        return new Promise(function(resolve, reject) {
          if (typeof body.email === 'string' && typeof body.password === 'string')
          {
            user.findOne({
              where: {
                email: body.email
              }
            })
            .then(
              (user) => {
                if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                  return reject();
                };
                resolve(user);
              },
              (e) => {
                return reject();
              });
            }
            else {
              return reject();
            }
        })
      },
      findByToken: function(token) {
        return new Promise((resolve, reject) => {
          try {
            var decodedJWT = jwt.verify(token, jwtPass);
            var bytes = cryptojs.AES.decrypt(decodedJWT.token, cryptPass);
            var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

            user.findById(tokenData.id)
              .then(
                (user) => {
                  if (user) {
                    resolve(user)
                  } else {
                    return reject();
                  }
                },
                (e) => { return reject() }
              );
          } catch(e) {
            return reject();
          }
        });
      }
    },
    hooks: {
      beforeValidate: (user, options) => {
        if (typeof user.email === 'string') {
          user.email = user.email.toLowerCase();
        };
      }
    }

  });
  return user;
}
