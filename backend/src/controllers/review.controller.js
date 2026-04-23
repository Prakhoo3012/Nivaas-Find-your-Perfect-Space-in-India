import { asyncHandler } from "../utils/asyncHandler.js";

const review = asyncHandler(async (req, res) => {
    console.log("Hello review ", req.body.bookingId)
    return res.send(req.body.bookingId)
})

export {review}