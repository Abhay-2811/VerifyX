const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

require("dotenv").config();
const lighthouse = require('@lighthouse-web3/sdk');
const { generateOTP } = require('../services/OTP');
const { sendMail } = require('../services/MAIL');
const { sha256 } = require('js-sha256');
const User = require('../models/User');

module.exports.signUpUser = async (req, res) => {
  const email = req.body.email;
  const email_hash = sha256(email).toString();
  const isExisting = await findUserByEmailHash(email_hash);
  if (isExisting) {
    return res.send('Already existing');
  }
  const newUser = await createUser(email);
  if (!newUser[0]) {
    return res.status(400).send({
      message: 'Unable to create new user',
  });
  }
  res.send(newUser);
};

module.exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const email_hash = sha256(email).toString();
  const user = await validateUserSignUp(email_hash, otp);
  if (!user[0]) {
    return res.status(400).send({ message: user[1] });
  }
  const apiKey = 'b746f948-dfb4-4e55-bf4f-154afdb97fb9'; 
  const response = await lighthouse.uploadText(
    email_hash,
    apiKey
  );
  res.send(response);
};

const createUser = async (email) => {
  const otpGenerated = generateOTP();
  const newUser = await User.create({
    email_hash : sha256(email).toString(),
    otp: otpGenerated
  });
  if (!newUser) {
    return [false, 'Unable to sign you up'];
  }
  try {
    await sendMail({
    to: email,
    OTP: otpGenerated,
  });
  return [true, newUser];
  } catch (error) {
    return [false, 'Unable to sign up, Please try again later', error];
  }
};

const validateUserSignUp = async (email_hash, otp) => {
  const user = await User.findOne({
  email_hash,
});
  if (!user) {
    return [false, 'User not found'];
  }
  if (user && user.otp !== otp) {
    return [false, 'Invalid OTP'];
  }
    return [true, user];
  };
  const findUserByEmailHash = async (email_hash) => {
      const user = await User.findOne({
        email_hash,
      });
      if (!user) {
        return false;
      }
      return user;
  };
