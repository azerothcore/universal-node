import "../defs"
import * as sys from "./sysUtil"

export const ROLES = {
    ROLE_USER: 0,
    ROLE_ADMIN: 1,
    ROLE_SUPERADMIN: 2
}

export default class ACL {
    constructor(field = "role", roles=ROLES) {
        this.field = field;
        /**@type {ROLES} */
        this.roles = roles;
    }

    checkLevel(user, levels) {
        if (!Array.isArray(levels))
            return user[this.field] >= levels;

        return levels.indexOf(user[this.field]) >= 0;
    }

    /**
     * This filter check if the user set in server context (logged with jwt) is the same
     * subject of the query/mutation. It allows you to avoid fetching/editing of data not
     * owned by the user.
     * 
     * @param {string} [model=undefined] : model name where get the field about user id (field parameter)
     * @param {string} [field=undefined] : you can specify model and field where retrieve userid from mutation data,
     *  otherwise it tries to get from where
     * @returns {SGSMiddleware} Middleware for graphql hooks/api
     */
    sameUser(model, field) {
        return (obj, data, context, info) => {
            let id;
            if (model && field && data[model][field]) {
                id = data[model][field];
            } else {
                id = data.where ? (field ? data.where[field] : data.where.id) : (data[field] ? data[field] : data.id);
            }

            if (sys.noAuth || this.checkLevel(context.user, [this.roles.ROLE_SUPERADMIN]) || context.user.id == id) {
                return Promise.resolve();
            }

            throw Error("Only admin or owner are authorized here!");
        }
    }

    /**
     * Middleware for sequelize-graphql-schema hooks
     * @param {ROLES[]} roles 
     * @param {SGSMiddleware} [filter=undefined] - function to filter isAllowed result
     */
    isAllowed(roles, filter) {
        return async (obj, data, context, info) => {
            if (sys.noAuth)
                return Promise.resolve();

            if (!context.user) throw Error("User not found");
            if (!this.checkLevel(context.user, roles)) throw Error("Permission denied for user:" + context.user.id);

            if (filter) {
                return await filter(obj, data, context, info);
            }

            return Promise.resolve();
        }
    }

    ownDataFilter(models, relModel, userKey, relKey) {
        return async function (obj, data, context, info) {
            let id = data.where ? data.where.id : data.id;

            if (sys.noAuth || this.checkLevel(context.user, [this.roles.ROLE_SUPERADMIN]))
                return Promise.resolve();

            if (!id) {
                if (obj && obj.constructor.name == relModel && obj[relKey])
                    id = obj[relKey];
                else
                    return Promise.reject("You cannot see all data of this query, use a specific id!");
            }

            let res = await models[relModel].findOne({
                where: {
                    [userKey]: context.user.id,
                    [relKey]: id
                }
            });

            if (!res)
                return Promise.reject("This element is not for you!");

            return Promise.resolve();
        }
    }
}
