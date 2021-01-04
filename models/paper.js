const Sequelize = require('sequelize');

module.exports = class Paper extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: true,
                unique: true
            }
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName:'Paper',
            tableName: 'papers',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db) {
        db.Paper.belongsTo(db.User, {foreignKey: 'papers', targetKey: 'id'});
        db.Paper.hasMany(db.Post, {foreignKey: 'posts', sourceKey: 'id'});
    }
}