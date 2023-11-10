const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
const UserIntresedArea = require('./UserIntrestedArea');

const sequelize = new Sequelize('sequlize_next_demo', 'developer', 'D#v#l0p#r', {
  host: '10.10.0.42',
  dialect: 'mysql',
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  interestArea: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hobbies: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  currentLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  images: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1,
  },
  deleted: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
});

User.hasMany(UserIntresedArea, {
  foreignKey: 'userId',
  as: 'userIntresedArea',
});

module.exports = User;
