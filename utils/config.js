const {
  PORT = 3000,
  DB = 'mongodb://127.0.0.1:27017/mestodb',
  JWT_SECRET = 'a1d731221cb2024fe9dfa90163bc4b40c2eefd1a4975d621f3d1484f71f5868c',
} = process.env;

module.exports = {
  PORT,
  DB,
  JWT_SECRET,
};
