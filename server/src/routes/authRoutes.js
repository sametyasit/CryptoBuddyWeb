// Şifre sıfırlama rotaları
router.post('/forgot-password', [
  check('email', 'Lütfen geçerli bir e-posta adresi girin').isEmail()
], authController.forgotPassword);

router.post('/verify-reset-token', [
  check('token', 'Token gerekli').exists()
], authController.verifyResetToken);

router.post('/reset-password', [
  check('token', 'Token gerekli').exists(),
  check('newPassword', 'Şifre en az 8 karakter uzunluğunda olmalıdır').isLength({ min: 8 })
], authController.resetPassword); 