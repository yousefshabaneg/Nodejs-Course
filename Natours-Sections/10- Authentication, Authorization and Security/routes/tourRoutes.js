const router = require('express').Router();
const tourController = require('../controllers/tourController');
const AuthMiddleware = require('../middleware/auth.middleware');

// router.param('id', tourController.checkID);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(AuthMiddleware.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    AuthMiddleware.protect,
    AuthMiddleware.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
