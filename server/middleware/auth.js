// import { getAuth, clerkClient } from "@clerk/express";

// export const protectAdmin = async (req, res, next) => {
//   try {
//     const { userId } = getAuth(req); // reads cookie automatically
//     console.log('your userId is ', userId);
//     if (!userId) return res.status(401).json({ success: false, message: "Unauthorized: No userId" });

//     const user = await clerkClient.users.getUser(userId);
//     if (user.privateMetadata.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     req.userId = userId;
//     next();
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


// middlewares/protectAdmin.js
import { getAuth, clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    // Extract user info from Clerk token
    const { userId, sessionId, getToken } = getAuth(req);
    

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No userId" });
    }

    // Get full user info from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Check admin role
    if (user.privateMetadata.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Not an admin" });
    }

    // Attach userId to request for future use
    req.userId = userId;

    next();
  } catch (err) {
    console.error("protectAdmin error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
