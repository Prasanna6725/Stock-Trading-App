const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    contact: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    balance: {
      type: Number,
      default: 100000,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function savePassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.matchPassword = async function matchPassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform(document, returnedObject) {
    delete returnedObject.password;
    return returnedObject;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
