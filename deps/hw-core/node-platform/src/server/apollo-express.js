import https from 'https'
import http from 'http'
import fs from 'fs';

import {
    GraphQLSchema,
    printSchema
} from 'graphql';
import {
    ApolloServer,
    mergeSchemas
} from 'apollo-server-express';

import sgs from "sequelize-graphql-schema/src/sequelize-graphql-schema";

/*
 *
 * PROJECT DEPS
 *
 */

import "../defs"

import {
    EventManager,
    Events
} from "../platform/EventManager"

import sgsConf from "./sgsConf"

import {
    verifyToken
} from "../libs/apiHelpers";

import appFactory from "./express.js";

import {
    noAuth
} from "../libs/sysUtil"

const defaultOptions = {
    getContextUser: null
}

export default class HwApolloExpress {
    /**
     * 
     * @param {Object} conf 
     * @param {EventManager} evtMgr 
     */
    constructor(conf, evtMgr, options = defaultOptions) {
        this.conf = conf;
        this.options = options;

        this.expressApp = appFactory(conf.express);

        this.sgsConf = sgsConf;

        this.evtMgr = evtMgr;

        this.userModel = null;

        this.schemas = []

        Object.freeze(this.expressApp)
        Object.freeze(this.evtMgr)
    }

    setOption(name, value) {
        this.options[name] = value;
    }

    setSchemas(schemas) {
        this.schemas = schemas;
    }

    setUserModel(model) {
        this.userModel = model;
    }

    /**
     * 
     * @param {*} db 
     */
    initApolloServer(db) {
        this.evtMgr.emit(Events.before_apollo_init, this);

        var schemas = [...this.schemas];

        const autogenSchema = new GraphQLSchema(sgs(this.sgsConf).generateSchema(db.models));

        schemas.push(autogenSchema);

        var mergedSchema = mergeSchemas({
            schemas
        });

        const server = new ApolloServer({
            cors: true,
            schema: mergedSchema,
            introspection: true,
            context: async ({
                req
            }) => {
                var decoded = verifyToken(req, this.conf.secret);
                if (decoded) {
                    if (this.options.getContextUser) {
                        return {
                            user: await this.options.getContextUser(decoded.id)
                        };
                    } else {
                        return {
                            user: await this.userModel.findOne({
                                where: {
                                    id: decoded.id
                                }
                            })
                        }
                    }
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
            app: this.expressApp
        });

        this.server = server;

        //Object.freeze(this.server);

        this.evtMgr.emit(Events.after_apollo_init, this);
    }

    async runServer() {
        const conf = this.conf;
        this.evtMgr.emit(Events.before_server_start, this);

        // Create the HTTPS or HTTP server, per configuration
        var _htserver
        const isSSL=this.conf.ssl && this.conf.ssl.enabled;
        if (isSSL) {
            // Assumes certificates are in .ssl folder from package root. Make sure the files
            // are secured.
            _htserver = https.createServer({
                    key: fs.readFileSync(this.conf.ssl.key),
                    cert: fs.readFileSync(this.conf.ssl.cert)
                },
                this.expressApp
            )
        } else {
            _htserver = http.createServer(this.expressApp);
        }

        this.server.installSubscriptionHandlers(_htserver)

        _htserver.listen({
            port: conf.serverPort
        }, () => {
            if (noAuth) {
                console.log("NO AUTH ACTIVATED!")
            }
            console.log(`🚀 Server ready at http${isSSL ? 's' : ''}://localhost:${conf.serverPort}${this.server.graphqlPath}`)
            this.evtMgr.emit(Events.after_server_start, this);
        })
    }
}
