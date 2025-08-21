import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import User from '../user/user.model';

const allFieldOfficerRequest = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const fieldOfficerQuery = new QueryBuilder(
    User.find({
      role: 'fieldOfficer',
      hubId: user._id,
      isAssignSpoke: false,
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
