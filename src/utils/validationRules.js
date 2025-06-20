const validationRules = {
   register: {
    name : {isRequired : true, isTrim : true},
    phoneNumber : {isRequired : true , isTrim : true, isValidPhone : true},
    email: { isRequired: false, isTrim: true, isValidEmail: true },
    password: { isRequired: true, isTrim: true}
   },

   login: {
    phoneNumber: { isRequired: true, isTrim: true, isValidPhone: true },
    password: { isRequired: true, isTrim: true }
   },

    reportSpam: {
        spamNumber: { isRequired: true, isTrim: true, isValidPhone: true },
    },

    searchByName: {
        name: { isRequired: true, isTrim: true },
    },

    searchByNumber: {
        phoneNumber: { isRequired: true, isTrim: true, isValidPhone: true },
    }
};

export default validationRules;
