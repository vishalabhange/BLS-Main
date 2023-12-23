import authController from '../controllers/AuthRoutes.mjs';
import LOGIN from '../controllers/AuthRoutes.mjs';
import { body } from 'express-validator'; // Import 'body' from 'express-validator'
import express from 'express';
const router = express.Router();

router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  LOGIN.login
);

router.post(
  '/signup',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({ min: 4 }),
  ],
  LOGIN.signup
);
const updateProfileValidation = [
  body('name').optional().isLength({ min: 3 }).withMessage('Enter a valid name'),
  body('email').optional().isEmail().withMessage('Enter a valid email'),
  body('contactNo').optional().isMobilePhone().withMessage('Enter a valid contact number'),
  body('shopName').optional().isLength({ min: 3 }).withMessage('Enter a valid shop name'),
  body('ProfileImg').optional().isLength({ min: 3 }).withMessage('Enter a valid image'),
  body('AdhaarNo').optional().isMobilePhone().withMessage('Enter a valid Adhaar number'),
  body('password').optional().isLength({ min: 4 }).withMessage('Password is too short'),
];

router.get('/Profile', LOGIN.getProfileCallback);

// Configure the updateProfile route with validation middleware
router.post('/updateProfile', updateProfileValidation, LOGIN.updateProfile)
router.post(
  '/forgetpassword',
  [
    body('email', 'Enter a valid email').isEmail()
  ],
  LOGIN.forgotPassword
);
router.post(
  '/resetpassword/:Name',
  [
    body('password', 'Password is too short').isLength({ min: 4 })
  ],
  LOGIN.resetPassword
);
router.post('/google', LOGIN.signup);



export default router;