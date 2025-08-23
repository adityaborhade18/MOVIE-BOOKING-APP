


import { clerkClient, getAuth } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No userId" });
    }

   
    const user = await clerkClient.users.getUser(userId);

   
    if (user.privateMetadata.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

  
    next();
  } catch (error) {
    console.error("protectAdmin error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
