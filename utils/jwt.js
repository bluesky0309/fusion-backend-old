const jwt = require("jsonwebtoken");
// const config = require("config");

// payload: Object,
// keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
// options: SignOptions

// export const signJwt = (payload, keyName, options) => {
//   const privateKey = Buffer.from(config.get(keyName), "base64").toString(
//     "ascii"
//   );
//   return jwt.sign(payload, privateKey, {
//     ...(options && options),
//     algorithm: "RS256",
//   });
// };

const verifyJwt = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = verifyJwt;
