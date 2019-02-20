import path from "path";
import Sequelize from 'sequelize/lib/sequelize.js';

import {
    development as dbConf
} from "@this/conf/database"


/** @type {Sequelize} */
const sequelize = new Sequelize(dbConf.database, dbConf.username, dbConf.password, {
    dialect: dbConf.dialect || "mysql",
    host: dbConf.host || "localhost",
    port: dbConf.port || "3306",
    operatorsAliases: false
});

/** @type {Sequelize.Model[]} */
const models = require('sequelize-auto-import')(sequelize, path.resolve(__dirname + "/models"));

export default {
    sequelize,
    models
}