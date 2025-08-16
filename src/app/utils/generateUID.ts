/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "mongoose";

async function generateUID(model: Model<any>, key: string) {
  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    let newIdNumber = "";

    // Use your reusable static
    const latestDoc = await (model as any).findLastOne();

    if (latestDoc && latestDoc.uid) {
      const lastNumber = parseInt(latestDoc.uid.split("-")[2]);
      const newNumber = (lastNumber + 1).toString().padStart(5, "0");
      newIdNumber = newNumber;
    } else {
      newIdNumber = "01";
    }

    return `${key}-${year}-${newIdNumber}`;
  } catch (err) {
    console.error("Error generating custom ID:", err);
    throw new Error("Failed to generate custom ID");
  }
}

export default generateUID;
