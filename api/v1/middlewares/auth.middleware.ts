import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log("Request headers:", req.headers);
  console.log("Authorization:", req.headers.authorization);

  try {
    if (!req.headers.authorization) {
      res.status(401).json({
        code: 401,
        message: "Vui lòng gửi kèm token"
      });
      return;
    }

    const token: string = req.headers.authorization.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      res.status(401).json({
        code: 401,
        message: "Token không được để trống"  
      });
      return;
    }

    const user = await User.findOne({
      deleted: false,
      token: token
    }).select("-password");

    if (!user) {
      res.status(401).json({
        code: 401,
        message: "Token không hợp lệ"
      });
      return;
    }

    req["user"] = user;
    next();
    
  } catch (error) {
    console.error("Error in requireAuth middleware:", error);
    res.status(500).json({
      code: 500, 
      message: "Lỗi server"
    });
  }
}