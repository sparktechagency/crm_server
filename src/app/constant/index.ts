export const USER_ROLE = {
  admin: 'admin',
  supervisor: 'supervisor',
  hr: 'hr',
  hubManager: 'hubManager',
  spokeManager: 'spokeManager',
  fieldOfficer: 'fieldOfficer',
} as const;

export const USER_STATUS = {
  active: 'active',
  blocked: 'blocked',
  deactivated: 'deactivated',
} as const;

export const GENDER = {
  male: 'male',
  female: 'female',
  others: 'others',
} as const;
