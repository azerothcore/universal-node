import Sequelize from "sequelize";

/**
 * @instance
 * @param {Sequelize} sequelize
 * @param {Sequelize} DataTypes
 */
export default function (sequelize, DataTypes) {

    var Circle = sequelize.define('Circle', {

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        privacy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        //Describes the policy used to public a post.        
        pubPolicy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    });

    return Circle;
}
