const Sequelize = require('sequelize');

module.exports = class Filter extends Sequelize.Model{
    static init(sequelize) {
        return super.init({
            id: {
                type: Sequelize.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            word: {
                type: Sequelize.STRING(20),
                allowNull: false,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName:'Filter',
            tableName: 'filters',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        });
    }
    static associate(db) {
        db.Filter.belongsTo(db.User, {foreignKey: 'userId', targetKey: 'user_id'});
    }
}