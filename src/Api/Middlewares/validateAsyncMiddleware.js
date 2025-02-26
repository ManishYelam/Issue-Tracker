// const Joi = require('joi');

// const validateAsync = (schema) => {
//   return async (req, res, next) => {
//     try {
//       await schema.validateAsync(req.body);
//       next();
//     } catch (error) {
//       return res.status(400).json({ message: error.details[0].message });
//     }
//   };
// };

// module.exports = validateAsync;

const validateAsync = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    // Check if error.details exists and has at least one entry
    const errorMessage = error.details?.[0]?.message || 'Validation failed';

    // Log error details for debugging
    console.error('Validation Error Details:', error.details);

    // Return a standardized error message
    return res.status(400).json({ message: errorMessage });
  }
};

module.exports = validateAsync;
