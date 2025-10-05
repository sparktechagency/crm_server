import { Router } from 'express';
import validateRequest from '../../middleware/validation';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

router
  .post('/two_factor_register', AuthController.twoFactorRegister)
  .post('/two_factor_login', AuthController.twoFactorLogin)
  .post(
    '/login',
    validateRequest(AuthValidation.loginValidation),
    AuthController.loginUser,
  )
  .post(
    '/forgot_password',
    validateRequest(AuthValidation.forgotPasswordValidation),
    AuthController.forgotPassword,
  )
  .post(
    '/verify_otp',
    validateRequest(AuthValidation.otpValidation),
    AuthController.verifyOtp,
  )
  .post(
    '/reset_password',
    validateRequest(AuthValidation.resetPasswordValidation),
    AuthController.resetPassword,
  )
  .post(
    '/change_password',
    validateRequest(AuthValidation.changePasswordValidation),
    AuthController.changePassword,
  )
  .post('/resend_otp', AuthController.resendOtp);

export const AuthRoutes = router;
