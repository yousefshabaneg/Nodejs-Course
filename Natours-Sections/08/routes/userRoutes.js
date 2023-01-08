const UserController = require('../controllers/userController');
const router = require('express').Router();

router.route('/').get(UserController.getAllUsers).post(UserController.createUser);
router.route('/:id').get(UserController.getUser).post(UserController.updateUser).delete(UserController.deleteUser);

module.exports = router;
