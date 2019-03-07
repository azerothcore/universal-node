/**
 * @typedef Db
 * @property {Sequelize.Model[]} models
 * @instance
 * @property {Sequelize} sequelize
 */


/**
 * Middleware for SequelizeGraphql scheme
 *
 * @async
 * @callback SGSMiddleware
 * @param {Object} obj
 * @param {Object} data
 * @param {Object} context
 * @param {Object} info
 * @returns {Promise} Promise object representing the resolve/rejection result
 */