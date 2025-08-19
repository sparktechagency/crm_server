import { USER_ROLE } from '../../constant';

export const uidForUserRole = (role: string) => {
  if (role === USER_ROLE.fieldOfficer) {
    return 'FO';
  } else if (role === USER_ROLE.hubManager) {
    return 'HM';
  } else if (role === USER_ROLE.spokeManager) {
    return 'SM';
  } else {
    return 'HR';
  }
};
