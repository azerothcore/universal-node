/*
 *
 * NODE INTERNALS
 *
 */
import {
    execSync
} from 'child_process';

/*
 *
 * INSTALLED MODULES
 *
 */

import sqs from "@this/src/server/sqs"

import {
    GraphQLSchema
} from 'graphql';
import {
    ApolloServer
} from 'apollo-server-express';

import Sequelize from "sequelize"

/*
 *
 * PROJECT DEPS
 *
 */
import db from "@this/src/system/entityLoader";

import {
    verifyToken
} from "@this/src/system/apiHelpers";

import app from "./express.js";

import {
    noAuth
} from "@this/src/system/sysUtil"

import {
    updateRecipes
} from "@this/src/system/updater";

async function dbSync() {

    const stdout = execSync("npm run db:migrate", {
        shell: true
    });

    if (stdout) {
        console.log(stdout.toString());
    }

    await db.sequelize.sync();

    // this is needed for migration
    // we've to save the information about db sync = first start
    await db.sequelize.getQueryInterface().upsert("SequelizeMeta", {
            name: "sync"
        }, {
            name: "sync"
        }, {
            name: "sync"
        },
        db.sequelize.define('SequelizeMeta', {
            name: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            }
        }), {});
}

async function runServer() {
    const autogenSchema = new GraphQLSchema(sqs.generateSchema(db.models));

    /*
    var mergedSchema = mergeSchemas({
        schemas: [rootTypeDef, autogenSchema]
    });*/

    const server = new ApolloServer({
        cors: true,
        schema: autogenSchema,
        context: async ({
            req
        }) => {
            var decoded = verifyToken(req);
            if (decoded) {
                var user = await db.models.User.findOne({
                    where: {
                        id: decoded.id
                    }
                });
                //if(!user) throw new Error("Can't find user with id: "+decoded.id);
                return {
                    user
                };
            }

            return null;
        },
        formatError: error => {
            console.log(error)
            //delete error.extensions.exception;
            return error;
        },
    });

    server.applyMiddleware({
        app
    });

    app.listen({
        port: 4000
    }, () => {
        if (noAuth) {
            console.log("NO AUTH ACTIVATED!")
        }
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    })

    //START CRON FOR GROCERY (SATURDAY AT 00.00)
    updateRecipes(db.models);
}

async function main() {
    if (process.argv.indexOf("--db-sync") >= 0) {
        await dbSync();
        console.log("DB Sync completed!")
        process.exit(0);
    } else {
        await dbSync();

        runServer();
    }
}

main();