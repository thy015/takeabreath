const axios = require("axios");
const { Owner, Admin } = require("../../models/signUp.model");
const {generalAccessTokens}=require('../../services/jwt')
//owner
const signUpOwner = async (req, res) => {
  const { ownerName, password, email, birthday, phoneNum, avatarLink } =
    req.body;

  if (!ownerName || !password || !email || !birthday || !phoneNum) {
    return res.status(403).json({ message: "Input is required" });
  } else if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  } else if (!validateBirthDate(birthday)) {
    return res.status(400).json({ message: "Not enough age" });
  }

  try {
    // Check if the account already exists
    const checkAccountExisted = await Owner.findOne({ email:email });
    const isAdmin = await Admin.findOne({ adminLogName: email});

    if (checkAccountExisted !== null || isAdmin !== null) {
      return res.status(400).json({
        status: "BAD",
        message: "Email existed",
      });
    }

    // Create the new owner account
    const createdOwner = await Owner.create({
      ownerName,
      password,
      email,
      birthday,
      phoneNum,
      avatarLink,
    });

    // Respond with success
    return res.status(201).json({
      status: "OK",
      message: "Succ",
      data: createdOwner,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: e.message || "Internal Server Error" });
  }
};

//chung của owner và admin
const signInOwner = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({ message: "Email and password are required" });
  }

  try {
    // Check for owner
    const foundOwner = await Owner.findOne({ email: email });

    if (foundOwner) {
      if (foundOwner.password !== password) {
        return res.json({
          status: "BAD",
          message: "Wrong password",
        });
      }
      const access_token = await generalAccessTokens({
        id: foundOwner._id,
        email: foundOwner.email,
        password: foundOwner.password,
        birthday: foundOwner.birthday,
        phoneNum: foundOwner.phoneNum,
        avatarLink: foundOwner.avatarLink,
        regDay: foundOwner.regDay,
      });

      return res.json({
        status: "OK",
        message: "Success log in",
        ownerID: foundOwner._id,
        access_token: access_token,
        redirect: "/",
      });
    }
    
    // Check for admin if owner not found
    const foundAdmin = await Admin.findOne({
      email: email,
      password: password,
    });
    console.log("Found Admin:", foundAdmin);

    if (foundAdmin) {
      const access_token = await generalAccessTokens({
        id: foundAdmin._id,
        adminName: foundAdmin.adminName,
      });

      return res.json({
        status: "OK",
        message: "Admin logged in",
        access_token:access_token,
        redirect: "/Admin",
      });
    }

    // If neither owner nor admin found
    return res.status(404).json({
      status: "BAD",
      message: "You haven’t registered yet",
    });
  } catch (error) {
    console.error("Error in signInOwner and admin:", error);
    return res.status(500).json({
      status: "ERROR",
      message: "Lỗi hệ thống",
    });
  }
};

// cus

const signUpCustomer = async (req, res) => {
  const { firstName, password, dob, phoneNumber, email, lastName } = req.body;
  try {
    console.log("Request body:", req.body);
    if (
      !firstName ||
      !phoneNumber ||
      !dob ||
      !password ||
      !lastName ||
      !email
    ) {
      return res.status(403).json({ message: "Input is required" });
    }

    const response = await axios.post(
      "https://api.htilssu.com/api/v1/auth/register",
      {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        dob: dob,
        phoneNumber: phoneNumber,
      }
    );

    console.log("Response from third-party service:", response.data);

    if (response.status === 200) {
      return res.status(201).json({
        status: "OK",
        message: "Successfully created customer",
        data: response.data,
      });
    } else {
      return res.status(400).json({
        status: "BAD",
        message: "Third-party service auth failed",
        data: response.data,
      });
    }
  } catch (e) {
    console.error(
      "Error during sign-up:",
      e.response ? e.response.data : e.message
    );
    return res.status(500).json({
      status: "BAD",
      message: "Internal server error in controller",
      error: {
        status: e.response ? e.response.status : "UNKNOWN",
        message: e.response
          ? e.response.data
          : e.message || "Unknown error occurred",
      },
    });
  }
};

const signInCustomer = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(403).json({ message: "Input is required" });
    }

    // Authenticate with the third-party service
    const response = await axios.post(
      "https://api.htilssu.com/api/v1/auth/login",
      {
        username: username,
        password: password,
      }
    );

    // Check response status
    if (response.status === 200) {
      const access_token = await generalAccessTokens({
        id: response.data.user.id,
        isUse: "customer",
      });

      return res.status(200).json({
        status: "OK",
        message: "Successfully signed in as customer",
        userID: response.data.user.id,
        access_token: access_token,
      });
    } else {
      return res.status(400).json({
        status: "BAD",
        message: "Third-party service auth failed",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error", error: e });
  }
};

function validateBirthDate(birthday) {
  const currentDay = new Date();
  const dob = new Date(birthday);
  const age = currentDay.getFullYear() - dob.getFullYear();
  const monthDiff = currentDay.getMonth() - dob.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDay.getDate() < dob.getDate())
  ) {
    age--;
  }
  if (age < 18) {
    return false;
  }
  return true;
}

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

module.exports = {
  signUpOwner,
  signInOwner,
  validateEmail,
  validateBirthDate,
  signUpCustomer,
  signInCustomer,
};
