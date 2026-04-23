import { AMENITIES, AVAILABILITY_STATUS, FURNISHING_STATUS, GENDER, PRICE_TYPE, PROPERTY_TYPE } from "../constants.js";
import  Property  from "../models/property.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadMultipleOnCloudinary } from "../utils/clodinaryMultipleFiles.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDeleteM_Files.js";
import geocoder from "../utils/geocoder.js";

const registerProperty = asyncHandler(async (req, res) => {
    // console.log("req.files →", req.files);
    // console.log("req.body  →", req.body);
    const {username} = req.user
    if(!username) {
        throw new ApiError(400, "Invalid User")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                role: "owner",
            }
        }
    )

    var {
        title,
        description,
        pricing,
        propertyType,
        furnishingStatus,
        gender,
        roomInfo,
        location,
        amenities,
        rules,
        availability,
        nearbyPlaces, 
        status,
    } = JSON.parse(req.body.data)
    if(
        [title,description,pricing.basePrice,location.address,location.city,location.state,location.country,location.pincode].some((field) => field?.trim === "") 
    ) {
        throw new ApiError(400, "All fields are required")
    }
    console.log(`Title: ${title} type: ${typeof(title)}`);
    // console.log(`City: ${location.city}`);

    if(pricing.priceType && !PRICE_TYPE.includes(pricing.priceType)) {
        throw new ApiError(400, `Invalid Price Type. Allowed values: ${PRICE_TYPE.join(", ")}`)
    }

    if(propertyType && !PROPERTY_TYPE.includes(propertyType)) {
        throw new ApiError(400, `Invalid Property Type. Allowed values: ${PROPERTY_TYPE.join(", ")}`)
    }

    if(furnishingStatus && !FURNISHING_STATUS.includes(furnishingStatus)) {
        throw new ApiError(400, `Invalid Furnishing Status. Allowed values: ${FURNISHING_STATUS.join(", ")}`)
    }

    if(gender && !GENDER.includes(gender)) {
        throw new ApiError(400, `Invalid Gender. Allowed values: ${GENDER.join(", ")}`)
    }

    // if(status && !AVAILABILITY_STATUS.includes(status)) {
    //     throw new ApiError(400, `Invalid Status. Allowed values: ${STATUS.join(", ")}`)
    // }

    // amenities
    if (typeof amenities === "string") {
        amenities = JSON.parse(amenities);
    }
    const invalidAmenities = amenities?.filter(
        (a) => !AMENITIES.includes(a)
    );
    if(invalidAmenities > 0) {
        throw new ApiError(400, "Amenities are missing");
    }

    // Near By Places
    if (nearbyPlaces && typeof nearbyPlaces === "string") {
        nearbyPlaces = JSON.parse(nearbyPlaces);
    }


    const fullAddress = `${location.address},${location.city}, ${location.state}, ${location.country}`;
    const geoData = await geocoder.geocode(fullAddress);
    // console.log("geoDATA: ", geoData);

    
    const latitude  = geoData[0]?.latitude;
    const longitude = geoData[0]?.longitude;
    if(!latitude && !longitude) {
        throw new ApiError(400, "Location not found")
    }

    const loc = {
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        pincode: location.pincode,
        landmark: location.landmark,
        coordinates: {
            type: "Point",
            coordinates: [latitude, longitude]
        }
    }

    // rules.petsAllowed = (petsAllowed === "true")
    // rules.smokingAllowed = (smokingAllowed === "true")
    // rules.alcoholAllowed = (alcoholAllowed === "true")
    // rules.guestsAllowed = (guestsAllowed === "true")
    // const rules = {
    //     petsAllowed,
    //     smokingAllowed,
    //     alcoholAllowed,
    //     guestsAllowed,
    //     additionalRules: additionalRules 
    // }

    // availability.isAvailable = (isAvailable === "true")
    // const availablity = {
    //     isAvailable,
    //     availableFrom,
    //     minimumStay,
    //     maximumStay
    // }

    // IMAGES
    const localImagePaths = req.files?.map(file => file.path);
    if(!localImagePaths) {
        throw new ApiError(400, "Images are required")
    }

    const uploadedImages = await uploadMultipleOnCloudinary(localImagePaths);
    // console.log("uploaded Images: ", uploadedImages) 
    if(!uploadedImages || uploadedImages.length === 0) {
        throw new ApiError(400, "Image Files are required")
    }

    const property = await Property.create({
        title,
        description,
        pricing,
        propertyType,
        furnishingStatus,
        gender,
        roomInfo,
        location: loc,
        amenities,
        rules,
        nearbyPlaces,
        availability,
        images: uploadedImages,
        amenities,
        status,
        owner: req.user._id
    })

    const createdProperty = await Property.findById(property._id)
    console.log(`Created: ${createdProperty}`)
    if(!createdProperty) {
        throw new ApiError(500, "Something bad happened")
    }

    return res.status(201).json(
        new ApiResponse(200, createdProperty, "Property Registered !!")
    )
})

const getAllProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find().sort({ createdAt: -1 }); // Newest to oldest

    return res.status(201).json(new ApiResponse(200, properties, "Fetched all properties"));
})

const getPropertyById = asyncHandler(async(req, res) => {
    // console.log(req.params.id)
    const property = await Property.findById(req.params.id).populate("owner")

    if(!property) {
        throw new ApiError(400, "Property not found")
    }

    return res.status(200).json(
        new ApiResponse(200, property, "Property Found")
    )
})

const updatePropertyInfo = asyncHandler(async (req, res) => {
    
    const property1 = await Property.findById(req.params.id)

    if(!property1) {
        throw new ApiError(400, "Property not found")
    }
    const userId = req.user._id
    if(!userId) {
        throw new ApiError(400, "User not found")
    }
    
    if(property1.owner !== userId) {    
        throw new ApiError(401, "Unauthorized Access")
    }


    var {
        title,
        description,
        price,
        priceType,
        propertyType,
        furnishingStatus,
        gender,
        totalRooms, 
        availableRooms,
        address, 
        city, 
        state,
        country, 
        pincode, 
        amenities,
        status
    } = req.body

    if(
        [title,description,address,city,state,country,pincode].some((field) => field?.trim === "") 
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if(priceType && !PRICE_TYPE.includes(priceType)) {
        throw new ApiError(400, `Invalid Price Type. Allowed values: ${PRICE_TYPE.join(", ")}`)
    }

    if(propertyType && !PROPERTY_TYPE.includes(propertyType)) {
        throw new ApiError(400, `Invalid Property Type. Allowed values: ${PROPERTY_TYPE.join(", ")}`)
    }

    if(furnishingStatus && !FURNISHING_STATUS.includes(furnishingStatus)) {
        throw new ApiError(400, `Invalid Furnishing Status. Allowed values: ${FURNISHING_STATUS.join(", ")}`)
    }

    if(gender && !GENDER.includes(gender)) {
        throw new ApiError(400, `Invalid Gender. Allowed values: ${GENDER.join(", ")}`)
    }

    if(status && !AVAILABILITY_STATUS.includes(status)) {
        throw new ApiError(400, `Invalid Status. Allowed values: ${STATUS.join(", ")}`)
    }

    // amenities
    if (amenities && typeof amenities === "string") {
        amenities = JSON.parse(amenities);
    }
    const invalidAmenities = amenities?.filter(
        (a) => !AMENITIES.includes(a)
    );
    if(invalidAmenities > 0) {
        throw new ApiError(400, "Amenities are missing");
    }

    // console.log("geoDATA: ", geoData);
    const fullAddress = `${address}, ${city}, ${state}, ${country}`;
    const geoData = await geocoder.geocode(fullAddress);

    
    const latitude  = geoData[0].latitude;
    const longitude = geoData[0].longitude;
    if(!latitude && !longitude) {
        throw new ApiError(400, "Location not found")
    }

    const loc = {
        address: address,
        city:city,
        state: state,
        country: country,
        pincode: pincode,
        coordinates: {
            type: "Point",
            coordinates: [latitude, longitude]
        }
    }

    const property = await Property.findByIdAndUpdate(
        req.params?.id,
        {
            $set: {
                title,
                description,
                price,
                priceType,
                propertyType,
                furnishingStatus,
                gender,
                totalRooms, 
                availableRooms,
                location: loc,
                amenities,
                status,
                owner: req.user._id,
            }
        },
        {
            new : true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, property, "Property Updated Successfully"))
})

const updatePropertyImages = asyncHandler(async(req, res) => {
    const newImages = req.files?.map((file) => file.path)
    if(!newImages) {
        throw new ApiError(400, "Images are required")
    }
    var property = await Property.findById(req.params.id)
    const oldImages = property.images
    const deletedImages = await deleteFromCloudinary(oldImages);
    // console.log(deletedImages);
    
    const uploadedImages = await uploadMultipleOnCloudinary(newImages);
    // console.log("uploaded Images: ", uploadedImages) 
    if(!uploadedImages || uploadedImages.length === 0) {
        throw new ApiError(400, "Image Files are required")
    }

    property = await Property.findByIdAndUpdate(
        property._id,
        {
            $set: {
                images: uploadedImages,
            }
        },
        {
            new: true
        }
    )
    return res
    .status(200)
    .json(new ApiResponse(200, property, "Images are uploaded Successfully"))
})

const getMyListings = asyncHandler(async(req, res) => {
    const myListings = await Property.find({owner: req.user._id}).sort({createdAt: -1})
    if(!myListings) {
        throw new ApiError(404, "No Property Registered by you")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, myListings, "Properties Found"))
})

export {
    registerProperty,
    getAllProperties,
    getPropertyById,
    updatePropertyInfo,
    updatePropertyImages,
    getMyListings,
}