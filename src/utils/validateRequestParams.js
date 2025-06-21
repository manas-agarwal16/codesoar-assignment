// This function checks for required parameters, trims strings, validates email and phone format
const validateRequestParams = (paramRules) => {
   return (req, res, next) => {
      const errors = [];

      for (const [key, param] of Object.entries(paramRules)) {
         let value = req.body?.[key] || req.query?.[key];

         // Required check
         if (
            param.isRequired &&
            (value === undefined || value === null || value === '')
         ) {
            errors.push({ message: `${key} is required.` });
            continue;
         }

         // Skip further checks if value is not present
         if (value === undefined || value === null || value === '') {
            continue;
         }

         // Trim
         if (param.isTrim && typeof value === 'string') {
            value = value.trim();
         }

         // Email validation
         if (param.isEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
            if (!emailRegex.test(value)) {
               errors.push({ message: `${key} must be a valid email.` });
               continue;
            }
         }

         // Phone validation
         if (param.isValidPhone) {
            const phoneRegex = /^\d{10}$/; // Regex for 10-digit phone number
            if (!phoneRegex.test(value)) {
               errors.push({
                  message: `${key} must be a valid 10-digit phone number.`,
               });
               continue;
            }
         }

         // Replace value in req
         if (req.body?.[key] !== undefined) req.body[key] = value;
         if (req.query?.[key] !== undefined) req.query[key] = value;
      }

      if (errors.length) {
         return res.status(400).json({
            status: 'failed',
            code: 400,
            message: errors[0].message,
         });
      }

      next();
   };
};

export default validateRequestParams;
