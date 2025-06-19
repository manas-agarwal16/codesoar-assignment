import axios from 'axios';

const API_KEY = process.env.FAST2SMS_API_KEY;

const sendSMS = async (to, message) => {
   try {

      console.log('hello from sendSMS');
      console.log('Sending SMS to:', to);
      console.log('Message:', message);

      const response = await axios.post(
         'https://www.fast2sms.com/dev/bulkV2',
         {
            variables_values: message,
            route: 'otp',
            numbers: to,
         },
         {
            headers: {
               authorization: API_KEY,
               'Content-Type': 'application/json',
            },
         }
      );

      console.log('SMS sent:', response.data);
      return response.data;
   } catch (error) {
      console.error('SMS error:', error.response?.data || error.message);
   }
};

export { sendSMS };
