import mongoose from 'mongoose';

const Loc = mongoose.model('Location');

const doSetAverageRating = async (location) => {
  if (location.reviews && location.reviews.length > 0) {
    const count = location.reviews.length;
    const total = location.reviews.reduce((acc, {rating}) => {
      return acc + rating;
    }, 0);
    
    location.rating = parseInt(total / count, 10);
    
    try {
      await location.save();
      console.log(`Average rating updated to ${location.rating}`);
    } catch (err) {
      console.log(err);
    }
  }
};

const updateAverageRating = async (locationId) => {
  try {
    const location = await Loc.findById(locationId).select('rating reviews').exec();
    if (location) {
      await doSetAverageRating(location);
    }
  } catch (err) {
    console.log(err);
  }
};

const doAddReview = async (req, res, location) => {
  if (!location) {
    return res.status(404).json({"message": "Location not found"});
  } else {
    const {author, rating, reviewText} = req.body;
    
    location.reviews.push({
      author,
      rating,
      reviewText
    });
    
    try {
      const savedLocation = await location.save();
      await updateAverageRating(savedLocation._id);
      const thisReview = savedLocation.reviews.slice(-1).pop();
      return res.status(201).json(thisReview);
    } catch (err) {
      return res.status(400).json(err);
    }
  }
};

const reviewsCreate = async (req, res) => {
  const locationId = req.params.locationid;
  if (locationId) {
    try {
      const location = await Loc.findById(locationId).select('reviews').exec();
      if (!location) {
        return res.status(404).json({"message": "Location not found"});
      }
      await doAddReview(req, res, location);
    } catch (err) {
      return res.status(400).json(err);
    }
  } else {
    return res.status(404).json({"message": "Not found, locationid required"});
  }
};

const reviewsReadOne = async (req, res) => {
  res.status(200).json({"status": "success"});
};

const reviewsUpdateOne = async (req, res) => {
  if (!req.params.locationid || !req.params.reviewid) {
    return res.status(404).json({
      "message": "Not found, locationid and reviewid are both required"
    });
  }

  try {
    const location = await Loc.findById(req.params.locationid).select('reviews').exec();
    if (!location) {
      return res.status(404).json({"message": "Location not found"});
    }

    if (location.reviews && location.reviews.length > 0) {
      const thisReview = location.reviews.id(req.params.reviewid);
      if (!thisReview) {
        return res.status(404).json({"message": "Review not found"});
      } else {
        thisReview.author = req.body.author;
        thisReview.rating = req.body.rating;
        thisReview.reviewText = req.body.reviewText;

        const savedLocation = await location.save();
        await updateAverageRating(savedLocation._id);
        return res.status(200).json(thisReview);
      }
    } else {
      return res.status(404).json({"message": "No review to update"});
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

const reviewsDeleteOne = async (req, res) => {
  const {locationid, reviewid} = req.params;
  if (!locationid || !reviewid) {
    return res.status(404).json({'message': 'Not found, locationid and reviewid are both required'});
  }

  try {
    const location = await Loc.findById(locationid).select('reviews').exec();
    if (!location) {
      return res.status(404).json({'message': 'Location not found'});
    }

    if (location.reviews && location.reviews.length > 0) {
      if (!location.reviews.id(reviewid)) {
        return res.status(404).json({'message': 'Review not found'});
      } else {
        location.reviews.id(reviewid).deleteOne();
        await location.save();
        await updateAverageRating(location._id);
        return res.status(204).json(null);
      }
    } else {
      return res.status(404).json({'message': 'No Review to delete'});
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

export {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};