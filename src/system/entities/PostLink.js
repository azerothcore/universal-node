import Sequelize from "sequelize";
/**
 * @instance
 * @param {Sequelize} sequelize
 * @param {Sequelize} DataTypes
 */
export default function (sequelize, DataTypes) {

    var PostLink = sequelize.define('PostLink', {
        //TODO: vedere i campi
    });

    PostLink.associate = function (models) {
        models.Post.belongsToMany(models.Post, { through: PostLink, as: 'Next', onDelete: 'CASCADE' });
    }

    return PostLink;
}