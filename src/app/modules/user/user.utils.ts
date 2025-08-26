import { USER_ROLE } from '../../constant';
import User from './user.model';

export const uidForUserRole = (role: string) => {
  if (role === USER_ROLE.fieldOfficer) {
    return 'FO';
  } else if (role === USER_ROLE.hubManager) {
    return 'HM';
  } else if (role === USER_ROLE.spokeManager) {
    return 'SM';
  } else if (role === USER_ROLE.supervisor) {
    return 'SU';
  }
  else {
    return 'HR';
  }
};

export const findUserWithUid = async (key: string) => {
  const findUser = await User.findOne({ uid: key });

  if (!findUser) {
    return;
  }

  let data = {};
  if (findUser.role === USER_ROLE.hubManager) {
    data = {
      hubId: findUser._id,
    };
  } else if (findUser.role === USER_ROLE.spokeManager) {
    data = {
      spokeId: findUser._id,
    };
  }

  return data;
};
