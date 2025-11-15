/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { USER_ROLE, USER_STATUS } from '../../constant';
import { TUser, UserModel } from './user.interface';

export const userSchema = new mongoose.Schema<TUser, UserModel>(
  {
    uid: {
      type: String,
      required: [true, 'UID is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      select: 0,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],

      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    locationProfileHubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LocationProfile',
    },
    locationSpokeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LocationSpoke',
    },
    myHubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    mySpokeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: [USER_STATUS.active, USER_STATUS.blocked, USER_STATUS.deactivated],
      default: USER_STATUS.active,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: [
        USER_ROLE.admin,
        USER_ROLE.supervisor,
        USER_ROLE.hr,
        USER_ROLE.hubManager,
        USER_ROLE.spokeManager,
        USER_ROLE.fieldOfficer,
      ],
      default: USER_ROLE.fieldOfficer,
    },
    isDeleted: { type: Boolean, default: false },
    isAssignSpoke: { type: Boolean, default: false },
    customFields: {
      type: Map,
      of: Schema.Types.Mixed, // value can be string, number, date, etc.
      default: {},
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

// query middlewares
userSchema.pre('find', async function (next) {
  const query = this as any;

  if (query.options.bypassMiddleware) {
    return next(); // Skip middleware if the flag is set
  }
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', async function (next) {
  const query = this as any;

  if (query.options.bypassMiddleware) {
    return next(); // Skip middleware if the flag is set
  }
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

userSchema.statics.findLastOne = async function () {
  return await this.findOne({}, null, { bypassMiddleware: true })
    .select('uid')
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();
};

userSchema.statics.isUserExist = async function (id: string) {
  return await User.findOne({ _id: id }).select('+password');
};

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

userSchema.statics.isMatchedPassword = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
};

const User = mongoose.model<TUser, UserModel>('User', userSchema);

export default User;
