import express from 'express';
import {
  homelist,
  locationInfo,
  addReview,
  doAddReview
} from '../controllers/locations.js';

const router = express.Router();

/* Locations pages */
router.get('/', homelist);
router.get('/location/:locationid', locationInfo);
router.route('/location/:locationid/review/new')
  .get(addReview)
  .post(doAddReview);

export default router;