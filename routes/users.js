const router = require('express').Router();
const {
  getAllUsers, getUser, updateProfile, updateAvatar, getMyInfo,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getMyInfo);
router.get('/:_id', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
