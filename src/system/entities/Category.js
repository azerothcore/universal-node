import Sequelize from "sequelize";

/**
 * @instance
 * @param {Sequelize} sequelize
 * @param {Sequelize} DataTypes
 */
export default function (sequelize, DataTypes) {

    var Category = sequelize.define('Category', {

        name:{
            type: DataTypes.STRING,
            allowNull: false,
        }

    });

    Category.associate = function(models){
        models.Category.belongsToMany(models.Category, { through: 'SubCategory', as: "SubCategories", onDelete: 'CASCADE' });
    }

    return Category;

}
