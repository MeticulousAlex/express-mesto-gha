const router = require('express').Router();
const {
  createUser, getAllUsers, getUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:_id', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
