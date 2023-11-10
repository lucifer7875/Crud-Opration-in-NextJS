const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sequlize_next_demo', 'developer', 'D#v#l0p#r', {
    host: '10.10.0.42',
    dialect: 'mysql',
});

const IntresedArea = sequelize.define('intrested_area', {
    id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    deleted: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
    },
});
sequelize.sync().then(() => {
    console.log('intrested area created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = IntresedArea;
