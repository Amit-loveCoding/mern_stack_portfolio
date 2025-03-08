export const generateToken = (user, message, statusCode, res) => {
  try {
    const token = user.generateJsonWebToken();

    res
      .status(statusCode)
      .cookie("token", token, {
        expires: new Date(Date.now() + Number(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production", 
        // sameSite: "Strict",
      })
      .json({
        success: true,
        message,
        token,
        user,
      });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
