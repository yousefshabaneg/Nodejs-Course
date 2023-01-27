const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`));

class UserController {
  static getAllUsers = (req, res) => {
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: users.length,
      data: {
        users,
      },
    });
  };

  static createUser = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = {
      id: newId,
      ...req.body,
    };
    tours.push(newTour);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: err.message,
        });
      }
      return res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    });
  };

  static getUser = (req, res) => {
    const tour = tours.find((t) => t.id === +req.params.id);
    if (!tour)
      return res.status(404).json({
        status: 'error',
        message: 'Tour not found',
      });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  };

  static updateUser = (req, res) => {
    if (+req.params.id >= tours.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Bad Request, Invalid tour ID',
      });
    }

    const tourIndex = tours.findIndex((t) => +t.id === +req.params.id);
    if (tourIndex === -1)
      return res.status(404).json({
        status: 'error',
        message: 'Tour not found',
      });
    Object.keys(req.body).forEach((key) => {
      if (tours[tourIndex][key]) tours[tourIndex][key] = req.body[key];
    });
    tours[tourIndex].id = +req.params.id;

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: err.message,
        });
      }
      return res.status(200).json({
        status: 'success',
        data: {
          tour: tours[tourIndex],
        },
        message: 'This tour has been updated',
      });
    });
  };

  static deleteUser = (req, res) => {
    if (+req.params.id >= tours.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Bad Request, Invalid tour ID',
      });
    }

    const tourIndex = tours.findIndex((t) => t.id === +req.params.id);
    if (tourIndex === -1)
      return res.status(404).json({
        status: 'error',
        message: 'Tour not found',
      });

    tours.splice(tourIndex, 1);
    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: err.message,
        });
      }
      return res.status(204).json({
        status: 'success',
        data: null,
        message: 'This tour has been deleted',
      });
    });
  };
}

module.exports = UserController;
