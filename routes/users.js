const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getCurrentUserInfo,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  userIdValidator,
  userDataValidator,
  userAvatarValidator,
} = require('../middlewares/validators/userValidator');

// Роутеры
router.get('/', getUsers);

router.get('/me', getCurrentUserInfo);

router.get('/:userId', userIdValidator, getUserById);

router.patch('/me', userDataValidator, updateProfile);

router.patch('/me/avatar', userAvatarValidator, updateAvatar);

module.exports = router;
