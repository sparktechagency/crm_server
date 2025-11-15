import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import { filteringCalculation } from '../../utils/filteringCalculation';
import User from '../user/user.model';

const allFieldOfficerRequest = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const { isAssignSpoke } = query;

  const { filtering } = query;

  const filteringData = filteringCalculation(filtering as string);

  const spokeStatus = isAssignSpoke === 'true' ? true : false;

  let matchStage = {};
  if (user.role === USER_ROLE.admin) {
    matchStage = {};
  } else if (user.role === USER_ROLE.hubManager) {
    matchStage = {
      locationProfileHubId: user.locationProfileHubId,
    };
  }

  const fieldOfficerQuery = new QueryBuilder(
    User.find({
      role: 'fieldOfficer',
      ...matchStage,
      ...filteringData,
      isAssignSpoke: spokeStatus,
    }),
    query,
  )
    .search(['customFields.name', 'email', 'phoneNumber'])
    .sort()
    .paginate()
    .filter(['status']);

  const [result, meta] = await Promise.all([
    fieldOfficerQuery.queryModel,
    fieldOfficerQuery.countTotal(),
  ]);

  return { meta, result };
};

export const HubManagerService = {
  allFieldOfficerRequest,
};
