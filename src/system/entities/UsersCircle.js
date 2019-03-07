import Sequelize from "sequelize";

/**
 * @instance
 * @param {Sequelize} sequelize
 * @param {Sequelize} DataTypes
 */

export default function(sequelize, DataType){

    var UserCircle = sequelize.define('UserCircle', {
        
        // 0 => normalUser, 1 => moderator, 2 => admin
        role: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    Circle.associate = function (models) {

        models.Circle.belongsToMany(models.User, { through: UserCircle, onDelete: 'CASCADE' });
        models.User.belongsToMany(models.Circle, { through: UserCircle, onDelete: 'CASCADE' });
    }

}