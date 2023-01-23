const router = require('express').Router();
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middleware/auth.middleware');

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

//Start using the current token
router.use(AuthMiddleware.protect);

router.patch('/updateMyPassword', AuthController.updatePassword);
router
  .route('/me')
  .get(UserController.getMe, UserController.getUser)
  .patch(UserController.updateMe)
  .delete(UserController.deleteMe);

//Admin protection.
router.use(AuthMiddleware.restrictTo('admin'));

router.route('/').get(UserController.getAllUsers);

router
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = router;
