const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

class ToursController {
  static aliasTopTours = async (req, res, next) => {
    req.query.sort = '-ratingsAverage,price';
    req.query.limit = '5';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };

  static getAllTours = async (req, res) => {
    try {
      //EXECUTE QUERY
      const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const tours = await features.query;

      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
          tours
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'failed',
        message: err.message
      });
    }
  };

  static createTour = async (req, res) => {
    try {
      const newTour = await Tour.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    } catch (err) {
      return res.status(500).json({
        status: 'failed',
        message: err.message
      });
    }
  };

  static getTour = async (req, res) => {
    try {
      const tour = await Tour.findById(req.params.id);
      if (!tour) {
        return res.status(404).json({
          status: 'error',
          message: 'Tour not found'
        });
      }
      res.status(200).json({
        status: 'success',
        data: {
          tour
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'failed',
        message: err.message
      });
    }
  };

  static updateTour = async (req, res) => {
    try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!tour) {
        return res.status(404).json({
          status: 'error',
          message: 'Tour not found'
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          tour
        },
        message: 'This tour has been updated'
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  };

  static deleteTour = async (req, res) => {
    try {
      await Tour.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
        message: 'This tour has been Deleted Successfully'
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  };

  static getTourStats = async (req, res) => {
    try {
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        {
          $sort: {
            avgPrice: 1
          }
        }
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
      ]);
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  };

  static getMonthlyPlan = async (req, res) => {
    try {
      const year = +req.params.year;
      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates'
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
          }
        },
        {
          $addFields: { month: '$_id' }
        },
        {
          $project: {
            _id: 0
          }
        },
        {
          $sort: { numTourStarts: -1 }
        }
      ]);
      res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: err.message
      });
    }
  };
}

module.exports = ToursController;
