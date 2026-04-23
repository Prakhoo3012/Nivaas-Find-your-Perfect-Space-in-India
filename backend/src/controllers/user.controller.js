import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { USER_ROLE } from "../constants.js";
import Booking from "../models/booking.model.js";
import Property from "../models/property.model.js";

const generateAcessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    console.log(user);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Tokens",
    );
  }
};

const userRegister = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { username, password, fullName, email, phone, role } = req.body;
  if (
    [username, password, fullName, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Username or Email is required");
  }
  console.log("Username: ", username);
  console.log("email: ", email);

  // Cheking if user already exists or not
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already registered");
  }

  // Profile Pic
  // console.log(req.files);
  let avatarLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.avatar) &&
    req.files.avatar.length > 0
  ) {
    avatarLocalPath = req.files.avatar[0].path;
  }

  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Avatar file is missing");
    }
  }

  if (role && !USER_ROLE.includes(role)) {
    throw new ApiError(
      400,
      `Invalid Role Type. Allowed Role Types are: ${USER_ROLE.join(", ")}`,
    );
  }

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    password,
    email,
    phone,
    role,
    avatar: avatar?.url || null,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering");
  }

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  console.log("Hello ", req.body);
  const { username, email, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "Username or Email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(401, "User does not exists");
  }

  // BUG
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(
    user._id,
  );

  // Send to cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const dashboardInfo = asyncHandler(async (req, res) => {
  const allReq = await Booking.find({ owner: req.user._id })
    .populate("owner")
    .populate("property")
    .populate("tenant")
    .sort({ createdAt: -1 });

  const allBookings = await Booking.find({ tenant: req.user._id })
    .populate("owner")
    .populate("property")
    .populate("tenant")
    .sort({ createdAt: -1 });

  const allListings = await Property.find({ owner: req.user._id }).sort({
    createdAt: -1,
  });
  // console.log(allListings.length);

  const data = {
    allReq,
    allListings,
    allBookings,
  };
  return res.status(200).json(new ApiResponse(200, data, "Done"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

export { userRegister, loginUser, logoutUser, getCurrentUser, dashboardInfo, refreshAccessToken };
