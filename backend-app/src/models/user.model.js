const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Email is not valid! ${value}`);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(`Enter Strong Password! ${value}`);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl: {
      type: String,
      default:
        'https://static.vecteezy.com/system/resources/previews/042/332/066/non_2x/person-photo-placeholder-woman-default-avatar-profile-icon-grey-photo-placeholder-female-no-photo-images-for-unfilled-user-profile-greyscale-illustration-for-social-media-free-vector.jpg',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(`This not valid Image ${value}`);
        }
      },
    },
    about: {
      type: String,
      default: 'This is default about of the user!',
    },
    skills: {
      type: [String],
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1, lastName: 1 }); // Compound index

userSchema.methods.getJWT = async function getJWT() {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, config.jwt.secret, {
    expiresIn: `${config.jwt.accessExpirationDays}d`,
  });
  return token;
};

userSchema.methods.validatePassword = async function validatePassword(passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
};

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
