import Sequelize from "sequelize";
/**
 * @instance
 * @param {Sequelize} sequelize
 * @param {Sequelize} DataTypes
 */
export default function (sequelize, DataTypes) {

    var TagAndInvitation = sequelize.define('TagAndInvitation', {

        bitMask: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }

    });

    TagAndInvitation.associate = function (models) {
        //Users can be tagged or/and invited to an activity
        models.User.belongsToMany(models.Post, { as:"TagsAndInvitation", through: TagAndInvitation, onDelete: 'CASCADE' });
        models.Post.belongsToMany(models.User, { as:"TagsAndInvitation", through: TagAndInvitation, onDelete: 'CASCADE' });
    }

    return TagAndInvitation;
}