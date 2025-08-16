import config from '../../config';
import { USER_ROLE } from '../constant';
import User from '../modules/user/user.model';
import colors from 'colors';
import generateUID from '../utils/generateUID';
import mongoose from 'mongoose';
import AppError from '../utils/AppError';
import httpStatus from 'http-status';
import Profile from '../modules/profile/profile.model';
import seedHopperCompany from './seedCompany';

const seedAdmin = async () => {
  // if admin is not exist
  const admin = {
    uid: await generateUID(),
    email: config.admin.admin_email,
    password: config.admin.admin_password,
    role: USER_ROLE.admin,
  };

  const isAdminExist = await User.findOne({ role: USER_ROLE.admin });

  if (!isAdminExist) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const user = await User.create([admin], { session });

      if (!user || user.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User not created');
      }

      const userId = user[0]._id;

      const createProfileData = {
        userId: userId,
      };

      const profile = await Profile.create([createProfileData], { session });

      if (!profile || profile.length === 0) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Profile not created');
      }

      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { profile: profile[0]._id },
        { session },
      );

      if (!updateUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User not updated');
      }

      if (updateUser) {
        // create hopper company
        seedHopperCompany();
      }

      await session.commitTransaction();
      session.endSession();
      console.log(colors.green(`Admin created successfully`).bold);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
};

export default seedAdmin;
