const passportLocalSequelize = require("passport-local-sequelize");
const { Model } = require("sequelize");  //: Model 직접 import

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static async findByPkAndUpdate(id, params) {
      let user = await User.findByPk(id);
      if (user) {
        user = await User.update(params, {
          where: { id: id }
        });
      }
      return user;
    }

    static async findByPkAndRemove(id) {
      let user = await User.findByPk(id);
      if (user) {
        user = await User.destroy({
          where: { id: id }
        });
      }
      return user;
    }
  }

  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(1024),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      town: {
        type: DataTypes.STRING,
        allowNull: false
      },
      detail: {
        type: DataTypes.STRING,
        allowNull: true
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      mysalt: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: "user",
      timestamps: false
    }
  );

  passportLocalSequelize.attachToUser(User, {
    usernameField: "email",
    hashField: "password",
    saltField: "mysalt"
  });

  return User;
};
