import {
    applyMiddlewares,
    uploadFile,
} from "@hw-core/node-platform/src/libs/apiHelpers";

import ACL from "@this/src/system/ACL"


const reference_folder = "upload/recipes/";

/**
 * @instance
 * @param {Sequelize} sequelize 
 * @param {Sequelize} DataTypes 
 */
export default function (sequelize, DataTypes) {

    var Recipe = sequelize.define('Recipe', {

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //time in minutes
        estimatedTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        //example cal -> 2300
        caloricIntake: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        chefNote: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        stepsDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        prepreparationsteps: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    // GraphQL-CRUD
    Recipe.graphql = {
        attributes: {
            include: {
                picture: "pictureType"
            }
        },
        before: {
            create: applyMiddlewares(
                ACL.isAllowed([ACL.roles.ROLE_ADMIN]),
                uploadFile("Recipe", reference_folder)
            ),
            update: applyMiddlewares(
                ACL.isAllowed([ACL.roles.ROLE_ADMIN]),
                uploadFile("Recipe", reference_folder)
            ),
            destroy: ACL.isAllowed([ACL.roles.ROLE_ADMIN]),
            fetch: ACL.isAllowed(
                [ACL.roles.ROLE_USER, ACL.roles.ROLE_ADMIN],
                ACL.ownDataFilter(sequelize.models, "UserRecipe", "UserId", "RecipeId")),
        },
        types: {
            countOut: {
                count: "Int"
            }
        },
        queries: {
            countRecipes:
            {
                output: "countOut",
                resolver: async (obj, data, context, info) => {
                    return {
                        count: Recipe.count(),
                    }
                }
            }
        }
    }

    return Recipe;
}