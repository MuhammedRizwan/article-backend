import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import dayjs from "dayjs";
import { comparePassword, hashPassword } from "../util/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../util/jwt";
import { CustomError } from "../util/custom_error";
import { JwtPayload } from "jsonwebtoken";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      throw new CustomError(400, "All fields are required");
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    let user;
    if (emailRegex.test(identifier)) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ phone: identifier });
    }
    if (!user) {
      throw new CustomError(404, "Invalid Email or Phone");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new CustomError(404, "Invalid Password");
    }
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,  
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ success: true, message: "Login successful", data: user });
    return;
  } catch (error) {
    next(error);
  }
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      dob,
      password,
      confirmPassword,
      articlePreferences,
    } = req.body;

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      throw new CustomError(400, "Email already exists");
    }

    const existPhone = await User.findOne({ phone });
    if (existPhone) {
      throw new CustomError(400, "Phone number already exists");
    }

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !dob ||
      !password ||
      !confirmPassword ||
      !articlePreferences
    ) {
      throw new CustomError(400, "All fields are required");
    }

    const adjustedDob = dayjs(dob).add(5, "hour").add(30, "minute").toDate();

    if (password !== confirmPassword) {
      throw new CustomError(400, "Passwords do not match");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      firstName,
      lastName,
      phone,
      email,
      dob: adjustedDob,
      password: hashedPassword,
      articlePreferences,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
    return;
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logout successful" });
    return;
  } catch (error) {
    next(new CustomError(500, "Logout failed", error));
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new CustomError(401, "Refresh token missing");
    }

    const payload: string | JwtPayload = verifyRefreshToken(refreshToken);

    if (typeof payload === "object" && "id" in payload) {
      const newAccessToken = generateAccessToken(payload.id);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
    } else {
      throw new CustomError(403, "Invalid payload");
    }

    res.status(200).json({ success: true, message: "Tokens refreshed" });
    return;
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      throw new CustomError(404, "User not found");
    }
    res.status(200).json({ success: true, message: "User found", data: user });
    return;
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, dob, articlePreferences } =
      req.body;
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError(404, "User not found");
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.dob = dob;
    user.articlePreferences = articlePreferences;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User updated", data: user });
    return;
  } catch (error) {
    next(error);
  }
}

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError(404, "User not found");
    }
    const isMatch = await comparePassword(currentPassword, user.password)
    if (!isMatch) {
      throw new CustomError(400, "Old password is incorrect");
    }
    if (newPassword !== confirmPassword) {
      throw new CustomError(
        400,
        "New password and confirm password do not match"
      );
    }
    user.password = await hashPassword(newPassword);
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
    return;
  } catch (error) {
    next(error);
  }
}
