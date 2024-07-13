import express from 'express';
import { check } from 'express-validator';
import { register, login, getUser } from '../controllers/auth-controller.mjs';
import auth from '../middleware/auth.mjs';

const router = express.Router();

// @route    POST api/auth/register
// @desc     Register user
// @access   Public
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  register
);

// @route    POST api/auth/login
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// @route    GET api/auth
// @desc     Get logged in user
// @access   Private
router.get('/', auth, getUser);

export default router;
