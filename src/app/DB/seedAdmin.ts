import colors from 'colors';
import httpStatus from 'http-status';
import config from '../../config';
import { passwordSend } from '../../shared/html/passwordSendingHtml';
import { USER_ROLE } from '../constant';
import User from '../modules/user/user.model';
import AppError from '../utils/AppError';
import generateUID from '../utils/generateUID';
import sendMail from '../utils/sendMail';

const seedAdmin = async () => {
  // if admin is not exist
  const generatePassword = Math.floor(10000000 + Math.random() * 90000000);
  const admin = {
    uid: await generateUID(User, 'admin'),
    name: 'Admin',
    email: config.admin.admin_email,
    password: generatePassword,
    // phoneNumber: '+8801712345678',
    image: 'public/uploads/images/images.jpeg',
    // address: 'Dhaka, Bangladesh',
    // nid: '123456789',
    role: USER_ROLE.admin,
  };

  const isAdminExist = await User.findOne({ role: USER_ROLE.admin });

  await sendMail({
    email: config.admin.admin_email as string,
    subject: 'Change Your Password Please',
    html: passwordSend(generatePassword, admin.uid as string),
  });

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
