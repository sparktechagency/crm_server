import { TFieldInterface } from '../../../../shared/validation/commonZodValidation';
import { LeadsAndClientsField } from './leadsAndClients.model';

const addLeadsAndClientsField = async (data: TFieldInterface) => {
  const result = await LeadsAndClientsField.create(data);
  return result;
};

const getLeadsAndClientsFields = async () => {
  const result = await LeadsAndClientsField.find();
  return result;
};

const updateLeadsAndClientsField = async (
  id: string,
  data: Partial<TFieldInterface>,
) => {
  const result = await LeadsAndClientsField.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

const deleteLeadsAndClientsField = async (id: string) => {
  const result = await LeadsAndClientsField.findByIdAndDelete(id);
  return result;
};

export const LeadsAndClientsFieldService = {
  addLeadsAndClientsField,
  getLeadsAndClientsFields,
  updateLeadsAndClientsField,
  deleteLeadsAndClientsField,
};
