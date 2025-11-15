import { ObjectId } from "mongoose";

export type TLocationSpoke = {
    locationSpokeId: string;
    locationSpokeName: string;
    hubLocationId: ObjectId;
};