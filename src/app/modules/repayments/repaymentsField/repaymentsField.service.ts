import { TFieldInterface } from '../../../../shared/validation/commonZodValidation';
import { DataEntry } from '../../leadsAndClients/leadsAndClientsFields/LeadsAndClientsField.service';
import { RepaymentsField } from './repaymentsField.model';

const addRepayments = async (data: TFieldInterface) => {
  const result = await RepaymentsField.create(data);
  return result;
};

const getRepaymentsField = async () => {
  const result = await RepaymentsField.find();
  return result;
};

const updateRepayments = async (id: string, data: Record<string, DataEntry>,) => {
  const filteredData: Record<string, DataEntry> = Object.fromEntries(
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    Object.entries(data).filter(([key, value]) => {
      const entry = value as DataEntry;
      return entry.label !== 'undefined';
    })
  );

  // Separate IDs (keys) and values (DataEntry)
  const ids = Object.keys(filteredData);
  const values = Object.values(filteredData);

  // Loop through ids and values and perform an update for each
  const updatePromises = ids.map((id, index) => {
    const value = values[index];

    // Prepare the update object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields: Record<string, any> = {};

    // Only add fields to update if they are not 'undefined'
    if (value.label !== 'undefined') updateFields.label = value.label;
    if (value.inputName !== 'undefined') updateFields.inputName = value.inputName;
    if (value.inputType !== 'undefined') updateFields.inputType = value.inputType;
    if (value.placeholder !== 'undefined') updateFields.placeholder = value.placeholder;

    return RepaymentsField.updateOne(
      { _id: id },
      { $set: updateFields }
    );
  });

  // Wait for all updates to finish
  const result = await Promise.all(updatePromises);
  return result;
};

const deleteRepayments = async (id: string) => {
  const result = await RepaymentsField.findByIdAndDelete(id);
  return result;
};

export const RepaymentsFieldService = {
  addRepayments,
  getRepaymentsField,
  updateRepayments,
  deleteRepayments,
};
