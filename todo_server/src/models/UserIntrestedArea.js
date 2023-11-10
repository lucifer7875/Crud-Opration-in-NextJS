const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
const IntresedArea = require('./IntrestedArea');

const sequelize = new Sequelize('sequlize_next_demo', 'developer', 'D#v#l0p#r', {
    host: '10.10.0.42',
    dialect: 'mysql',
});

const UserIntresedArea = sequelize.define('user_intrested_area', {
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
    intrestedAreaId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
    },
});
sequelize.sync().then(() => {
    console.log('user intrested area created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

UserIntresedArea.belongsTo(IntresedArea, {
    foreignKey: 'intrestedAreaId',
    targetKey: 'id',
    as: 'tag',
});

module.exports = UserIntresedArea;
