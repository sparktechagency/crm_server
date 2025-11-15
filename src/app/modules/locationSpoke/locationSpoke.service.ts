import LocationSpoke from "./location.model";
import { TLocationSpoke } from "./locationSpoke.interface";

const createLocationSpoke = async (payload: TLocationSpoke) => {
    const locationSpoke = await LocationSpoke.create(payload);
    return locationSpoke;
};

export const LocationSpokeService = {
    createLocationSpoke,
};