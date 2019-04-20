import ACL from "@this/src/system/ACL"

/**
 * @instance
 * @param {Sequelize} sequelize 
 * @param {Sequelize} DataTypes 
 */
export default function (sequelize, DataTypes) {
    var UserRecipe = sequelize.define('UserRecipe', {

        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });

    UserRecipe.associate = function (models) {
        //connection 1:n -> user to userRecipe
        models.User.hasMany(models.UserRecipe, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        models.UserRecipe.belongsTo(models.User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });

        //connection 1:n -> recipe to userRecipe
        models.Recipe.hasMany(models.UserRecipe, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
        models.UserRecipe.belongsTo(models.Recipe, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' });
    }

    UserRecipe.graphql = {
        before: {
            create: ACL.isAllowed([ACL.roles.ROLE_ADMIN]),
            update: ACL.isAllowed([ACL.roles.ROLE_ADMIN]),
            destroy: ACL.isAllowed([ACL.roles.ROLE_ADMIN]),
            fetch: ACL.isAllowed(
                [ACL.roles.ROLE_USER, ACL.roles.ROLE_ADMIN],
                ACL.sameUser(null, "UserId")
            ),
        }
    }

    return UserRecipe;
};