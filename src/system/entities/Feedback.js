import {
    applyMiddlewares,
    uploadFile,
} from "@hw-core/node-platform/src/libs/apiHelpers";

import ACL from "@this/src/system/ACL"

const reference_folder = "upload/feedbacks/";

/**
 * @instance
 * @param {Sequelize} sequelize 
 * @param {Sequelize} DataTypes 
 */
export default function (sequelize, DataTypes) {

    var Feedback = sequelize.define('Feedback', {
        //the name is the PATH
        picture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false
        },

    });

    Feedback.associate = function (models) {
        //connection 1:n -> recipe to feedback
        models.Recipe.hasMany(models.Feedback);
        models.Feedback.belongsTo(models.Recipe);
        //connection 1:n -> user to feedback
        models.User.hasMany(models.Feedback);
        models.Feedback.belongsTo(models.User);
    }

    Feedback.graphql = {
        attributes: {
            include: {
                picture: "pictureType"
            }
        }, 
        before: {
            create: applyMiddlewares(
                ACL.isAllowed([ACL.roles.ROLE_USER], ACL.sameUser("Feedback","UserId")),
                uploadFile("Feedback", reference_folder)
            ),
            update: applyMiddlewares(
                ACL.isAllowed([ACL.roles.ROLE_USER], ACL.sameUser("Feedback","UserId")),
                uploadFile("Feedback", reference_folder)
            ),
            destroy: ACL.isAllowed([ACL.roles.ROLE_ADMIN, ACL.roles.ROLE_USER]),
            fetch: ACL.isAllowed([ACL.roles.ROLE_USER, ACL.roles.ROLE_ADMIN], ACL.sameUser(null,"UserId")),
        },
        types: {
            countInput: {
                recipeId:"Int"
            },
            countOut: {
                count: "Int"
            }
        },
        queries: {
            countFeedbacks:
            {
                input:"countInput",
                output: "countOut",
                resolver: async (obj, data, context, info) => {
                    return {
                        count: await Feedback.count({
                            where: {
                                RecipeId : data.countInput.recipeId
                            }
                        }),
                    }
                }
            }
        }
    }

    return Feedback;
};