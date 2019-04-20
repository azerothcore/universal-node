import Sequelize from "sequelize";
/**
 * @instance
 * @param {Sequelize} sequelize
 * @param {Sequelize} DataTypes
 */
export default function (sequelize, DataTypes) {

    var Post = sequelize.define('Post', {

        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        privacy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Post.associate = function (models) {

        models.User.hasMany(models.Post, { as: "UserPost" });
        models.Post.belongsTo(models.User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        models.Circle.hasMany(models.Post);
        models.Post.belongsTo(models.Circle, { foreignKey: { allowNull: true }, onDelete: 'CASCADE' });

        models.Post.belongsTo(models.Post, { as: 'answerOf', foreignKey: { allowNull: true } });

        models.Post.belongsToMany(models.Category, { through: 'CategoryRel', onDelete: 'CASCADE' });
        models.Category.belongsToMany(models.Post, { through: 'CategoryRel', onDelete: 'CASCADE' });
    }


    return Post;



}