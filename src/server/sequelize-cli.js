// this file is only used by sequelize-cli
// allowing some pre-operations, do not edit
require('dotenv').config();

require('module-alias/register');

require("@babel/register")({})

const Sequelize = require("sequelize");

/**
 * This function is injected in global scope for sequelize-cli
 * allowing migrations to understand if it's the "first start"
 * checking for sync value in sequelizemeta table.
 * Using this function in your migration to return from migration
 * if sequelizeFirstStart returns true, we don't need migrations at first
 * start since the sync() method in server.js import all modules
 * at their last version automatically.
 * 
 * After first start ends the server.js will write the sync value
 * in table and next migration will be executed.
 * 
 * @param {Sequelize.queryInterface} queryInterface
 */
global.sequelizeFirstStart = async function (queryInterface) {
    let res = await queryInterface.sequelize.query("SELECT name FROM SequelizeMeta WHERE name='sync'", {
        type: queryInterface.sequelize.QueryTypes.SELECT
    });

    return res.length==0;
}

var confs=require('@this/conf/database');

for (let name in confs) {
    if (!confs[name].hasOwnProperty("operatorsAliases"))
       confs[name]["operatorsAliases"] = false;
}

// Import the rest of our application.
module.exports = confs;