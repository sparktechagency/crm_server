/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'mongoose';

async function generateUID(model: Model<any>, key?: string) {
  try {
    const latestDoc = await (model as any).findLastOne();

    // If key is provided, use the old format (key-year-number)
    if (key) {
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      let newIdNumber = '';

      if (latestDoc && latestDoc.uid) {
        const parts = latestDoc.uid.split('-');
        const lastNumber = parseInt(parts[parts.length - 1]) || 0;
        const newNumber = (lastNumber + 1).toString().padStart(5, '0');
        newIdNumber = newNumber;
      } else {
        newIdNumber = '00001';
      }

      return `${key}-${year}-${newIdNumber}`;
    }

    // If no key is provided, generate plain numeric UID (for users)
    let newIdNumber = '';

    if (latestDoc && latestDoc.uid) {
      const isPlainNumeric = /^\d+$/.test(latestDoc.uid);

      if (isPlainNumeric) {
        const lastNumber = parseInt(latestDoc.uid);
        const newNumber = lastNumber + 1;
        newIdNumber = newNumber.toString().padStart(6, '0'); // 6 digits: 000123
      } else {
        // Fallback for old format (key-year-number) - extract just the number part
        const parts = latestDoc.uid.split('-');
        const lastNumber = parts.length > 0 ? parseInt(parts[parts.length - 1]) : 0;
        const newNumber = lastNumber + 1;
        newIdNumber = newNumber.toString().padStart(6, '0'); // 6 digits: 000123
      }
    } else {
      // First user gets 000001
      newIdNumber = '000001';
    }

    return newIdNumber;
  } catch (err) {
    console.error('Error generating custom ID:', err);
    throw new Error('Failed to generate custom ID');
  }
}

export default generateUID;
