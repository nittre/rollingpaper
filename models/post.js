const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            text: {
                type: Sequelize.STRING(200),
                allowNull: false,
                unique: true
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
        db.Post.belongsTo(db.Paper, {foreignKey: 'posts', sourceKey: 'id'});
    }
}