const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const User = require('./user');
const Paper = require('./paper');
const Post = require('./post');
const Filter = require('./filter');

const sequelize = new Sequelize(config.databse, config.username, config.password, config);

db.User = User;
db.Paper = Paper;
db.Post = Post;
db.Filter = Filter;

User.init(sequelize);
Paper.init(sequelize);
Post.init(sequelize);
Filter.init(sequelize);

User.associate(db);
Paper.associate(db);
Post.associate(db);
Filter.associate(db);

db.sequelize = sequelize;

module.exports = db;
