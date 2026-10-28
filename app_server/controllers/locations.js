import request from 'request';

const apiOptions = {
  server: 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://loc8r-api.onrender.com';
}

const showError = (req, res, status) => {
  let title = '';
  let content = '';
  if (status === 404) {
    title = '404, page not found';
    content = 'Oh dear. Looks like you can\'t find this page. Sorry.';
  } else {
    title = `${status}, something's gone wrong`;
    content = 'Something, somewhere, has gone just a little bit wrong.';
  }
  res.status(status);
  res.render('generic-text', {
    title,
    content
  });
};

const homelist = (req, res) => {
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: 'Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you\'re looking for.',
    locations: [
      {
        name: 'Starcups',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 3,
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        distance: '100m'
      },
      {
        name: 'Cafe Hero',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 4,
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        distance: '200m'
      },
      {
        name: 'Burger Queen',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 2,
        facilities: ['Food', 'Premium wifi'],
        distance: '250m'
      }
    ]
  });
};

const renderDetailPage = (req, res, location) => {
  res.render('location-info', {
    title: location.name,
    pageHeader: {
      title: location.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location
  });
};

const locationInfo = (req, res) => {
  getLocationInfo(req, res, (req, res, responseData) => renderDetailPage(req, res, responseData));
};

const renderReviewForm = function (req, res, {name}) {
  res.render('location-review-form', {
    title: `Review ${name} on Loc8r`,
    pageHeader: { title: `Review ${name}` },
    error: req.query.err 
  });
};
const addReview = (req, res) => {
  getLocationInfo(req, res, (req, res, responseData) => renderReviewForm(req, res, responseData));
};

const getLocationInfo = (req, res, callback) => {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  };
  request(
    requestOptions,
    (err, {statusCode}, body) => {
      let data = body;
      if (statusCode === 200) {
        data.coords = {
          lng: body.coords[0],
          lat: body.coords[1]
        };
        callback(req, res, data);
      } else {
        showError(req, res, statusCode);
      }
    }
  );
};

const locationsCreate = (req, res) => {
  res.render('index', { title: 'Create location' });
};

const locationsListByDistance = (req, res) => {
  res.render('index', { title: 'Locations list by distance' });
};

const locationsReadOne = (req, res) => {
  res.render('index', { title: 'Location read one' });
};

const locationsUpdateOne = (req, res) => {
  res.render('index', { title: 'Update location' });
};

const locationsDeleteOne = (req, res) => {
  res.render('index', { title: 'Delete location' });
};

const doAddReview = (req, res) => {
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'POST',
    json: postdata
  };
  
  request(
    requestOptions,
    (err, {statusCode}, body) => {
      if (statusCode === 201) {
        res.redirect(`/location/${locationid}`);
      } else if (statusCode === 400 && body.name && body.name === 'ValidationError') {
        
        res.redirect(`/location/${locationid}/review/new?err=val`);
      } else {
        showError(req, res, statusCode);
      }
    }
  );
};

export {
  homelist,
  locationInfo,
  addReview,
  doAddReview,
  locationsCreate,
  locationsListByDistance,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};