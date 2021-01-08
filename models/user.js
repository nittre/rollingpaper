const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            user_id: {
                type: Sequelize.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nickname: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: false
            },
            sns_id: {
                type: Sequelize.STRING(60),
            },
            provider: {
                type: Sequelize.STRING(15),
                allowNull: true
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING(100),
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName:'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db) {
        db.User.hasMany(db.Paper, {foreignKey: 'sender_id', sourceKey: 'user_id'});
        db.User.hasMany(db.Paper, {foreignKey: 'userId', sourceKey: 'user_id'});
        db.User.hasMany(db.Filter, {foreignKey: 'userId', soureKey: 'user_id'});
    }
}