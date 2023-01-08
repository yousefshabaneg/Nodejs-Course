const router = require('express').Router();
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const AuthMiddleware = require('../middleware/auth.middleware');

router.post('/signup', AuthController.signup);
router.post('/login', AuthController.login);

router.post('/forgotPassword', AuthController.forgotPassword);
router.patch('/resetPassword/:token', AuthController.resetPassword);

router.patch(
  '/updateMyPassword',
  AuthMiddleware.protect,
  AuthController.updatePassword
);

router.patch('/updateMe', AuthMiddleware.protect, UserController.updateMe);
router.delete('/deleteMe', AuthMiddleware.protect, UserController.deleteMe);

router
  .route('/')
  .get(UserController.getAllUsers)
  .post(UserController.createUser);
router
  .route('/:id')
  .get(UserController.getUser)
  .delete(UserController.deleteUser);

module.exports = router;
