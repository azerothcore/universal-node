import sqs from "sequelize-graphql-schema/src/sequelize-graphql-schema";



import {
    GraphQLString,
    GraphQLInputObjectType
} from 'graphql';
import {
    GraphQLUpload
} from 'apollo-server-express';

import {
    rootTypeDef
} from "@this/src/system/graphScheme"

const _export=sqs({
    remote: rootTypeDef,
    customTypes: {
        "Upload": GraphQLUpload,
        "pictureType": GraphQLString,
        "pictureTypeInput": new GraphQLInputObjectType({
            name: "pictureTypeInput",
            fields: {
                file: {
                    type: GraphQLUpload,
                    description: "Upload Apollo Scalar type, needs apollo-client-upload"
                },
                encoded: {
                    type: GraphQLString,
                    description: "Alternative to Apollo Upload, if set will be used instead of file field"
                }
            }
        })
    }
});

export default _export;