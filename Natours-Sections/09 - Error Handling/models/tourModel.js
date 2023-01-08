const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'A tour must have a name'],
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters'
      ],
      minlength: [
        10,
        'A tour name must have more than or equal to 10 characters'
      ]
      // validate: [validator.isAlpha, 'A tour name must only contains characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      trim: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult'
      },
      required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: 'Discount price ({VALUE}) should be below regular price',
        validator: function(val) {
          return val < this.price;
        }
      }
    },
    summary: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover']
    },
    images: {
      type: [String]
    },
    startDates: {
      type: [Date]
    },
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//Document Middleware: run before .save(), .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('This will save document');
//   next();
//   //call next in previous pre middleware is required if you have more than one pre middleware, otherwise next is not required
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY Middleware

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();

  next();
});

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  this.start = Date.now();

  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query Took: ${Date.now() - this.start}ms`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
