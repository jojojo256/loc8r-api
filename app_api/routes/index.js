import express from 'express';
import {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
} from '../controllers/locations.js';
import {
  reviewsReadOne,
  reviewsCreate,
  reviewsUpdateOne,
  reviewsDeleteOne
} from '../controllers/reviews.js';

const router = express.Router();

// 장소(Location) 관련 라우트
router
  .route('/locations')
  .get(locationsListByDistance)
  .post(locationsCreate);

router
  .route('/locations/:locationid')
  .get(locationsReadOne)
  .put(locationsUpdateOne)
  .delete(locationsDeleteOne);

// 리뷰(Review) 추가 라우트 (11-2 실습용)
router
  .route('/locations/:locationid/reviews')
  .post(reviewsCreate);

// 리뷰(Review) 개별 조회, 수정, 삭제 라우트 (11-3, 11-4 실습용 포함)
router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(reviewsReadOne)
  .put(reviewsUpdateOne)
  .delete(reviewsDeleteOne);

export default router;