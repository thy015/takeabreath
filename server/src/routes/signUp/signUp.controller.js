//signUp,signIn
const signUpService = require("../../services/services");
const services = require("../../services/services");
const axios = require("axios");

const signUpOwner = async (req, res) => {
  try {
    const {
      name,
      passWord,
      email,
      birthDate,
      phoneNum,
      address,
      dueDatePCCC,
      dueDateKD,
    } = req.body;

    if (
      !name ||
      !passWord ||
      !email ||
      !birthDate ||
      !phoneNum ||
      !address ||
      !dueDatePCCC ||
      !dueDateKD
    ) {
      return res.status(403).json({ message: "Input is required" });
    } else if (!validateEmail(email)) {
      //email
      return res.status(400).json({ message: "Invalid email" });
    } else if (!validateBirthDate(birthDate)) {
      return res.status(400).json({ message: "Not enough age" });
    } else {
      const currentDate = new Date();
      const validDueDatePCCC =
        new Date(dueDatePCCC).getFullYear - currentDate.getFullYear();
      const validDueDateKD =
        new Date(dueDateKD).getFullYear - currentDate.getFullYear();

      if (validDueDateKD <= 1 || validDueDatePCCC <= 1) {
        return res.status(400).json({ message: "Invalid due date" });
      }
    }
    const result = await signUpService.signUpOwner(req.body);
    return res.status(201).json(result);
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

const signInOwner = async (req, res) => {
  console.log(req.body);
  const { email, passWord } = req.body;

  if (!email || !passWord) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  try {
    const result = await signUpService.signInOwner({ email, passWord });

    if (result.status === "OK") {
      return res.json({
        status: "OK",
        message: "Đăng nhập thành công",
        ownerID: result.ownerID,
        access_token: result.access_token,
        redirect: result.redirect,
      });
    } else {
      return res.json({
        status: "BAD",
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in signInOwner:", error);
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

    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === "OK"
    ) {
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
    if (!password || !username) {
      return res.status(403).json({ message: "Input is required" });
    }
    const result = await services.signInCustomer(req.body);
    if (result.status === "OK") {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (e) {
    return res.status(500).json(e);
  }
};

function validateBirthDate(birthDate) {
  const currentDay = new Date();
  const dob = new Date(birthDate);
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
