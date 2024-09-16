const generateOtp = () => {
  const otpLength = 5; // Length of the OTP
  let otp = "";

  for (let i = 0; i < otpLength; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

module.exports = { generateOtp };
