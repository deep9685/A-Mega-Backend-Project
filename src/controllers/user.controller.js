import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // get user detail
    const { fullName, email, username, password } = req.body;
    
    // validation
    if ([fullName, email, username, password].some((field) =>
        field?.trim === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // check for existing user
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already existed.")
    }

    // check for images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    
    // if (coverImageLocalPath) {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // }

    // check for avatar 
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // create user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // check for user created or not
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user!");
    }

    // send response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created Successfully.")
    );

});


export {
    registerUser,
}