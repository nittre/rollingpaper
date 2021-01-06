const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            text: {
                type: Sequelize.STRING(200),
                allowNull: false,
                unique: true
            },
            show: {
                type: Sequelize.BOOLEAN,
                defaultValue: 1
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName:'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db) {
        db.Post.belongsTo(db.Paper, {foreignKey: 'posts', sourceKey: 'paper_id'});
    }
}