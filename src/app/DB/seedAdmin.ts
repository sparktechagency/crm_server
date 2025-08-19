import colors from 'colors';
import httpStatus from 'http-status';
import config from '../../config';
import { USER_ROLE } from '../constant';
import User from '../modules/user/user.model';
import AppError from '../utils/AppError';
import generateUID from '../utils/generateUID';

const seedAdmin = async () => {
  // if admin is not exist
  const admin = {
    uid: await generateUID(User, 'admin'),
    name: 'Admin',
    email: config.admin.admin_email,
    password: config.admin.admin_password,
    phoneNumber: '+8801712345678',
    image: 'public/uploads/images/images.jpeg',
    address: 'Dhaka, Bangladesh',
    nid: '123456789',
    role: USER_ROLE.admin,
  };

  const isAdminExist = await User.findOne({ role: USER_ROLE.admin });

  if (!isAdminExist) {
    try {
      const created = await User.create(admin);
      console.log(created);
      console.log(colors.green('Admin created successfully'));
    } catch (error) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Admin not created');
    }
  }
};

export default seedAdmin;
