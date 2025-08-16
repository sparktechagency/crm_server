import { model, Schema } from "mongoose";
import { TLocationProfile } from "./locationProfile.interface";

const locationProfileSchema = new Schema<TLocationProfile>({
    hubId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    locationName: {
        type: String,
        required: [true, 'Location name is required'],
    },
    locationId: {
        type: String,
        required: [true, 'Location id is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
    },
    excelFormula: {
        type: String,
        required: [true, 'Excel formula is required'],
    },
}, {
    timestamps: true
})

const LocationProfile = model<TLocationProfile>('LocationProfile', locationProfileSchema);

export default LocationProfile;