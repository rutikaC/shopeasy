import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler( async(req , res)=> {
    // get data 
    const {fullName, email, phone, password} = req.body;

    // validate
    if(
        [fullName, email, phone, password]
        .some((field)=> !field || field?.trim()==="")
    ){
        throw new ApiError(400, "All fields are requied")
    }
    // user exist
    const existingUser= await User.findOne({
        $or:[
            {email},
            {phone}
            ]
    })

    if(existingUser){
        throw new ApiError(409,"User with this email already exists.")
    }

    // upload avatar
    let avatarLocalPath = req.files?.avatar[0]?.path
    let avatarUrl;
  
    if (avatarLocalPath) {
    const cloudinaryResponse = await uploadOnCloudinary(avatarLocalPath);
    avatarUrl = cloudinaryResponse?.url || "";
    }

   

    // upload to cloudinary
    // const avatar = await uploadOnCloudinary(avatarLocalPath)

    // if(!avatar){
    //     throw new ApiError(400, "Avatar file is required")
    // }

    // creat use in db
    const user = await User.create({
         fullName,
         email,
         phone,
         password,
         avatar:avatarUrl 
    })

    // check create or not
    const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong in user registeration.")
    }

    // resturn res
    return res
    .status(201)
    .json(
        new ApiResponse(
            201, 
            createdUser,
            "User registerd successfully"
        )
    )
}) 

const loginUser  = asyncHandler(async(req, res )=> {
        // get data
    const {email, password} = req.body;

    // validate
    if(!email, !password){
        throw new ApiError(400, "All fields are requiered")
    }

    // find user
    const user  = await User.findOne({
        $or:[{email}]
    })

    if(!user){
        throw new ApiError(404, "User not found")
    }
    // check password

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid credentials")
    }
    // generate tokne
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBefoureSave: false})

    // remove senstive feilds 
    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    const cookieOptions = {
        httpOnly:true,
        secure: true
    }

    return res.status(201)
    .json(
        new ApiResponse(
            201,
            {user: loginUser},
            "User logged In Successfully"
        )
    )

})

export {registerUser, loginUser}