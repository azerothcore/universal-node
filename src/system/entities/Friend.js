import Sequelize from "sequelize";
/**
 * @instance
 * @param {Sequelize} sequelize
 * @param {Sequelize} DataTypes
 */
export default function (sequelize, DataTypes) {

    var Friend = sequelize.define('Friend', {
        flag: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Friend.associate = function (models) {

        models.User.belongsToMany(models.User, { through: Friend, as: "FriendOf", onDelete: 'CASCADE' });
    }

    return Friend;
}