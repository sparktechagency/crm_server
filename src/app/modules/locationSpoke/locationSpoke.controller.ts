import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LocationSpokeService } from "./locationSpoke.service";

const createLocationSpoke = catchAsync(async (req, res) => {
    const result = await LocationSpokeService.createLocationSpoke(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Location spoke created successfully',
        data: result,
    });
});

export const LocationSpokeController = {
    createLocationSpoke,
};