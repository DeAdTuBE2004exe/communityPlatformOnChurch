const { registerUser } = require("../services/auth.service");

async function register(req, res) {
  try {
    const {
      uname,
      uemail,
      uphone,
      upassword,
      uconfirmpassword,
      ccode,
    } = req.body;

    // Required field check
    if (!uname || !uemail || !upassword || !uconfirmpassword) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    // Confirm password validation
    if (upassword !== uconfirmpassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const user = await registerUser({
      uname,
      uemail,
      upassword,
      uphone,
      ccode,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = { register };

//login

const { loginUser } = require("../services/auth.service");

async function login(req, res) {
  try {
    const { uemail, upassword } = req.body;

    if (!uemail || !upassword) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser({ uemail, upassword });

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
}
module.exports = { register, login };