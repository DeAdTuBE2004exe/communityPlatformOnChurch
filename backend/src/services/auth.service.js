const pool = require("../config/db");
const { hashPassword } = require("../utils/password");
const { v7: uuidv7 } = require("uuid");

async function registerUser(data) {
  const { uname, uemail, upassword, uphone, ccode } = data;

  // 1. Check email existence (indexed)
  const emailCheck = await pool.query(
    "SELECT 1 FROM tbluser1 WHERE uemail = $1",
    [uemail]
  );

  if (emailCheck.rowCount > 0) {
    throw new Error("Email already registered");
  }

  // 2. Hash password
  const passwordHash = await hashPassword(upassword);

  // 3. Generate UUID v7
  const uid = uuidv7();

  // 4. Insert user
  await pool.query(
    `
    INSERT INTO tbluser1 (
      uid, uname, uemail, upassword, uphone, ccode,
      uisplatform, uisemployee, uisfollower
    )
    VALUES ($1, $2, $3, $4, $5, $6, false, false, true)
    `,
    [uid, uname, uemail, passwordHash, uphone || null, ccode || null]
  );

  return { uid, uemail };
}

module.exports = { registerUser };

//login 
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/token");

async function loginUser({ uemail, upassword }) {
  // 1. Find user
  const result = await pool.query(
    `
    SELECT uid, uemail, upassword, uisplatform, uisemployee, uisfollower
    FROM tbluser1
    WHERE uemail = $1 AND ustatus = 'ACTIVE'
    `,
    [uemail]
  );

  if (result.rowCount === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  // 2. Verify password
  const isMatch = await comparePassword(upassword, user.upassword);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // 3. Decide user type
  let userType = "FOLLOWER";
  let redirectTo = "/user";

  if (user.uisplatform) {
    userType = "PLATFORM";
    redirectTo = "/platform";
  } else if (user.uisemployee) {
    userType = "EMPLOYEE";
    redirectTo = "/church";
  }

  // 4. Generate JWT
  const token = generateToken({
    uid: user.uid,
    userType,
  });

  return { token, userType, redirectTo };
}
module.exports = {registerUser,loginUser,};