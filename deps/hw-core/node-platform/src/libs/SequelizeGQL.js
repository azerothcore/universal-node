import Sequelize from "sequelize"
import "sequelize-graphql-schema/src/jsdoc.def.js"

/**
 * @typedef SequelizeGQLName
 * @property {Array} fields 
 * @property {string} format 
 */

/**
 * @typedef SequelizeGQLAuth
 * @property {Array|number} roles 
 * @property {boolean} sameUser 
 */

/**
 * @typedef SGQLGQLFieldConstructor
 * @property {SequelizeGQLAuth} constructor.auth
 */
export class SGQLGQLField {
    /** @param {SGQLGQLFieldConstructor} constructor*/
    constructor({ auth } = {}, type = "Field") {
        this.auth = auth
        this.type = type;
        //Object.defineProperty(this, "type", { value: type, configurable: false, writable: false });
    }

    /**
     * This method will create a "flattened"
     * object with all inherited properties ready for json
     */
    toJSON() {
        var tmp = {};

        for (var key in this) {
            if (typeof this[key] !== 'function')
                tmp[key] = this[key];
        }

        return tmp;
    }
}

/**
 * @typedef SGQLTextFieldArgs
 * @property {boolean} canHtml
 * 
 * @typedef {SGQLGQLFieldConstructor & SGQLTextFieldArgs} SGQLTextFieldConstructor
 */
export class SGQLTextField extends SGQLGQLField {
    /** @param {SGQLTextFieldConstructor} constructor*/
    constructor({ canHtml = false, ...superArgs } = {}, type = "Text") {
        super(superArgs, type);
        this.canHtml = canHtml;
    }
}

export class SGQLEmailField extends SGQLGQLField {

    /** @param {SGQLGQLFieldConstructor} constructor*/
    constructor({ ...superArgs } = {}, type = "Email") {
        super(superArgs, type);
    }
}

/**
 * @typedef SGQLEnumFieldArgs
 * @property {Array<string>} labels - labels for enum values
 * 
 * @typedef {SGQLGQLFieldConstructor & SGQLEnumFieldArgs} SGQLEnumFieldConstructor
 */
export class SGQLEnumField extends SGQLGQLField {

    /** @param {SGQLEnumFieldConstructor} constructor */
    constructor({ labels = [], ...superArgs } = {}, type = "Enum") {
        super(superArgs, type);
        this.labels = labels;
    }
}

export class SGQLFileField extends SGQLGQLField {
    /** 
     * @param {SGQLGQLFieldConstructor} constructor
     */
    constructor({ ...superArgs } = {}, type = "File") {
        super(superArgs, type);
    }
}

export class SGQLPictureField extends SGQLFileField {
    /**
     *  @param {SGQLGQLFieldConstructor} constructor 
     */
    constructor({ ...superArgs } = {}, type = "Picture") {
        super(superArgs, type);
    }
}

/**
 * @typedef SequelizeGQLQuery
 * @property {SequelizeGQLAuth} auth
 * @property {Object.<string,SGQLGQLField>} fields 
 */

/**
 * @typedef SequelizeGQLQueries
 * @property {SequelizeGQLQuery} all - options defined here will be used as base of all kind of queries. 
 * Such rules will be overwritten by more specific queries rules (fetch, create, delete, update)
 * @property {SequelizeGQLQuery} fetch
 * @property {SequelizeGQLQuery} create 
 * @property {SequelizeGQLQuery} delete
 * @property {SequelizeGQLQuery} update
 */

/**
 * @typedef SequelizeGQLInfo
 * @property {boolean} isReference - inform 3rd party tools that it's a reference table (can be used to avoid direct CRUD operations on it)
 * @property {string} idField 
 * @property {string|SequelizeGQLName} name 
 * @property {Array<string>} searchFields
 * @property {SequelizeGQLQueries} api
 * 
 */

/**
 * @typedef SequelizeGQLOpt
 * @property {SeqGraphQL} graphql
 * @property {SequelizeGQLInfo} info 
 */
/** @type {SequelizeGQLOpt} */
var defOpt = {
    graphql: {
        queries: {}
    },
    info: {
        api: {
            all: {
                auth: {
                },
                fields: {
                }
            }
        }
    }
}

/**
 * This function will monkey-patch a Sequelize Model injecting the graphql property 
 * for sequelize-graphql-schema library extended with some useful info for "Default" query.
 * @instance
 * @param {Sequelize.Model} model - The sequelize model to monkey patch.
 * @param {SequelizeGQLOpt} opt - object with all information needed for sequelize-graphql-schema and our node-platform lib.
 */
export function define(model, opt = defOpt) {
    let name = model.name.charAt(0).toLowerCase() + model.name.slice(1);

    if (!opt.graphql) {
        opt.graphql = {}
    }

    if (!opt.graphql.queries)
        opt.graphql.queries = {}

    if (!opt.info) {
        opt.info = {}
    }

    opt.graphql.queries[name + "Default"] = {
        resolver: () => {
            let modelInfo = {
                fields: {},
                associations: {}
            };

            for (let attr in model.rawAttributes) {
                modelInfo.fields[attr] = {
                    ...model.rawAttributes[attr]
                }

                delete modelInfo.fields[attr]["Model"];
            }



            for (let attr in model.associations) {
                let assocInfo = model.associations[attr];
                modelInfo.associations[attr] = {
                    as: assocInfo.as,
                    associationType: assocInfo.associationType,
                    foreignKey: assocInfo.foreignKey,
                    foreignIdentifier: assocInfo.foreignIdentifier,
                    otherKey: assocInfo.otherKey,
                    foreignKeyField: assocInfo.foreignKeyField,
                    isAliased: assocInfo.isAliased,
                    isMultiAssociation: assocInfo.isMultiAssociation,
                    isSelfAssociation: assocInfo.isSelfAssociation,
                    sourceIdentifier: assocInfo.sourceIdentifier,
                    sourceKey: assocInfo.sourceKey,
                    target: assocInfo.target.name,
                }
            }

            if (opt.info.api && opt.info.api.all) {
                opt.info.api = {
                    create: {
                        ...opt.info.api.all,
                        ...opt.info.api.create
                    },
                    fetch: {
                        ...opt.info.api.all,
                        ...opt.info.api.fetch
                    },
                    update: {
                        ...opt.info.api.all,
                        ...opt.info.api.update
                    },
                    delete: {
                        ...opt.info.api.all,
                        ...opt.info.api.delete
                    }
                }
            }

            return JSON.stringify({
                modelInfo,
                ...opt.info,
            })
        }
    }

    model.graphql = opt.graphql;
}

export default {
    define
}
