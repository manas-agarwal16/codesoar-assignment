const verificationCodeGenerator = (length = 4) => {
   let verificationCode = '';
   for (let i = 0; i < length; i++) {
      verificationCode += Math.floor(Math.random() * 10).toString();
   }
   return verificationCode;
};

export { verificationCodeGenerator };