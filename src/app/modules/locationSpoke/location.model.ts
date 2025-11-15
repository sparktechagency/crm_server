import { model, Schema } from "mongoose";
import { TLocationSpoke } from "./locationSpoke.interface";

const locationSpokeSchema = new Schema<TLocationSpoke>({
    locationSpokeId: {
        type: String,
        required: true,
        unique: true,
    },
    locationSpokeName: {
        type: String,
        required: true,
        unique: true,
    },
    hubLocationId: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

const LocationSpoke = model<TLocationSpoke>('LocationSpoke', locationSpokeSchema);

export default LocationSpoke;