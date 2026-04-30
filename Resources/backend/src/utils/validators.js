const { body, param, query } = require('express-validator');

// TODO: Buat pola regex untuk validasi berikut (jangan gunakan pola yang diberikan di completed_backend).
// Email: harus valid (misal: user@domain.com).
// Password: minimal 10 karakter, mengandung huruf besar, huruf kecil, angka, dan karakter spesial.
// Username: hanya boleh mengandung huruf, angka, dan underscore (3-20 karakter).
// Phone: format internasional (opsional, dapat dimulai dengan +, diikuti digit, spasi, atau strip).
// Description: opsional, bebas tetapi batasi panjang (misal maksimal 500 karakter).

// Constants with Validation regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{10,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const phoneRegex = /^\+?[0-9\s\-]+$/;

// Validation rules
const userRegistrationValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .matches(usernameRegex).withMessage('Username can only contain letters, numbers, and underscores (3-20 characters)'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .matches(emailRegex).withMessage('Email format is invalid'),
  body('phone')
    .optional()
    .trim()
    .matches(phoneRegex).withMessage('Phone format is invalid (international format allowed)'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .matches(passwordRegex).withMessage('Password must be at least 10 characters and contain an uppercase letter, a lowercase letter, a number, and a special character'),
  body('balance')
    .optional()
    .isNumeric().withMessage('Balance must be a numeric value')
    .isInt({ min: 0 }).withMessage('Balance must be a non-negative integer')
    .toInt(), // Memaksa dan mengecilkan tipe datanya ke integer bawaan javascript
];

const userUpdateValidation = [
  body('id')
    .optional().isInt().withMessage('User ID must be an integer'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
  body('username')
    .optional()
    .trim()
    .matches(usernameRegex).withMessage('Username can only contain letters, numbers, and underscores (3-20 characters)'),
  body('email')
    .optional()
    .trim()
    .matches(emailRegex).withMessage('Email format is invalid'),
  body('phone')
    .optional()
    .trim()
    .matches(phoneRegex).withMessage('Phone format is invalid'),
  body('password')
    .optional()
    .trim()
    .matches(passwordRegex).withMessage('Password must be at least 10 characters and contain an uppercase letter, a lowercase letter, a number, and a special character'),
  body('balance')
    .optional()
    .isInt({ min: 0 }).withMessage('Balance must be a non-negative integer'),
];

const transactionCreationValidation = [
  body('user_id')
    .isNumeric().withMessage('User ID must be a numeric value')
    .isInt().withMessage('User ID must be an integer').toInt(),
  body('item_id')
    .isNumeric().withMessage('Item ID must be a numeric value')
    .isInt().withMessage('Item ID must be an integer').toInt(),
  body('quantity')
    .isNumeric().withMessage('Quantity must be a numeric value')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer').toInt(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be at most 500 characters'),
];

const transactionIdValidation = [
  param('id')
    .isNumeric().withMessage('Transaction ID must be numeric')
    .isInt().withMessage('Transaction ID must be an integer').toInt(),
];

const validate = (req, res, next) => {
  const errors = require('express-validator').validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: messages.join('. '),
      payload: null,
    });
  }
  next();
};

module.exports = {
  // emailRegex, passwordRegex, phoneRegex dihapus
  userRegistrationValidation,
  userUpdateValidation,
  transactionCreationValidation,
  transactionIdValidation,
  validate,
};