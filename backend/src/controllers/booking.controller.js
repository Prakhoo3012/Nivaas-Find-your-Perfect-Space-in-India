import Booking from "../models/booking.model.js";
import { Property } from "../models/property.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBooking = asyncHandler(async(req, res) => {
    const {propertyId, bookingType, checkIn, checkOut, adults, childrens} = req.body

    const property = await Property.findById(propertyId);
    if(!property) {
        throw new ApiError(400, "Property Not Found")
    }

    const {basePrice, securityDeposit, maintenanceCharges} = property.pricing

    let noOfNights = null
    let noOfMonths = null
    let totalAmt = 0;

    if(bookingType === "per_month") {
        const msPerMonth = 1000 * 60 * 60 * 24 * 30;
        noOfMonths = Math.ceil(new Date(checkOut) - new Date(checkIn)) / msPerMonth;
        totalAmt = noOfMonths * basePrice + securityDeposit + maintenanceCharges;
    } else {
        const msPerNight = 1000 * 60 * 60 * 24;
        noOfNights = Math.ceil(new Date(checkOut) - new Date(checkIn)) / msPerNight;
        totalAmt = noOfNights * basePrice + securityDeposit;
    }

    const booking = await Booking.create({
        property: propertyId,
        tenant: req.user._id,
        owner: property.owner,
        bookingType,
        checkIn,
        checkOut,
        guests: {
            adults: adults,
            childrens: childrens
        },
        priceBreakdown: {
            basePrice,
            numberOfMonths: noOfMonths,
            numberOfNights: noOfNights,
            securityDeposit,
            maintenanceCharges,
            discount: 0,
            totalAmount: totalAmt
        }
    })
    if(!booking) {
        throw new ApiError(400, "Something Bad Happened")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking Initiated"))
})

const getAllBooking = asyncHandler(async(req, res) => {
    const bookings = await Booking.find().sort({createdAt: -1})
    if(!bookings) {
        return new ApiError(400, "Bookings not found")
    }

    return res.status(200).json(new ApiResponse(200, bookings, "All Booking Found"))
})

const getBookingById = asyncHandler(async(req, res) => {
    const booking = await Booking.findById(req.params.id).populate("property").populate("tenant").populate("owner")
    if(!booking) {
        return new ApiError(400, "Booking not found")
    }
    console.log(booking);

    return res.status(200).json(new ApiResponse(200, booking, "Booking Found"))
})

const updateStatus = asyncHandler(async(req, res) => {
    console.log(req.body.paymentStatus);
    const {status, paymentStatus} = req.body;
    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                status: status,
                paymentStatus: paymentStatus 
            }
        },
        {
            new: true
        }
    )

    return res.status(200).json(new ApiResponse(200, booking._id, "Status Updated"))
})

export {
    createBooking,
    getBookingById,
    getAllBooking,
    updateStatus,
}