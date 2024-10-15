const bcrypt = require("bcrypt");
const { Owner, Admin, Customer } = require("../../models/signUp.model");
const { generalAccessTokens } = require("../../services/jwt");
//owner
const signUpOwner = async (req, res) => {

  const { ownerName, password, email, birthday, phone, idenCard} =
    req.body;

  console.log("[body]", { ownerName, password, email, birthday, phone, idenCard })

  if (!ownerName || !password || !email || !birthday || !phone ||!idenCard) {

    return res.status(403).json({ message: "Input is required" });
  } else if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email" });
  } 

  try {
    // Check if the account already exists
    const checkAccountExisted = await Owner.findOne({ email: email });
    const isAdmin = await Admin.findOne({ email: email });
    if (checkAccountExisted !== null || isAdmin !== null) {
      return res.status(400).json({
        status: "BAD",
        message: "Email existed",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    // Create the new owner account
    const createdOwner = new Owner({
      ownerName:name,
      password:hashPassword,
      email:email,
      phoneNum:phone,
      idenCard:idenCard
    });

    await createdOwner.save()
    // Respond with success
    return res.status(200).json({
      status: "OK",
      register:true,
      message: "Succ",
      data: createdOwner,
    });
  } catch (e) {
    return res
      .status(500)
      .json({message: "Internal Server Error" });
  }
};

//chung của owner và admin
const signInOwner = async (req, res) => {
  const {email, password} = req.body
  console.log( {email, password})
  if (!email || !password) {
    return res.status(403).json({ message: "Email and password are required" });
  }

  try {
    // Check for owner
    const foundOwner = await Owner.findOne({ email: email });

    if (foundOwner) {
      let checkPassword = await bcrypt.compare(password, foundOwner.password)
      if (!checkPassword) {
        return res.status(400).json({
          login: false,
          status: "BAD",
          message: "Wrong password",
        });
      }
      const access_token = await generalAccessTokens({
        id: foundOwner._id,
        email: foundOwner.email,
        name:foundOwner.ownerName,
        birthday: foundOwner.birthday,
        phoneNum: foundOwner.phoneNum,
        avatarLink: foundOwner.avatarLink,
        regDay: foundOwner.regDay,
      });

      return res.status(200).cookie("token", access_token, { httpOnly: true, secure: true }).json({
        login: true,
        status: "OK",
        message: "Success log in",
        id: foundOwner._id,
        name: foundOwner.ownerName,
        redirect: "/Owner",
      });
    }

    // Check for admin if owner not found
    const foundAdmin = await Admin.findOne({
      email: email
    });

    if (foundAdmin) {
      let checkPassword = await bcrypt.compare(password, foundAdmin.password)
      if (!checkPassword) {
        return res.status(400).json({
          login: false,
          status: "BAD",
          message: "Wrong password",
        });
      }
      const access_token = await generalAccessTokens({
        id: foundAdmin._id,
        name: foundAdmin.adminName,
        email:foundAdmin.email
      });

      return res.status(200).cookie("token", access_token, { httpOnly: true, secure: true }).json({
        status: "OK",
        message: "Admin logged in",
        access_token: access_token,
        name: foundAdmin.adminName,
        id:foundAdmin._id,
        login: true,
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

const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(403).json({ login: false, message: "Not found data !" });
  }

  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const isCorrectPass = await bcrypt.compare(password, customer.password);
    if (!isCorrectPass) {
      return res.status(401).json({ login: false, message: "Pasword incorret" });
    }

    const token = await generalAccessTokens({
      id: customer._id,
      name: customer.cusName,
      email: customer.email,
      phoneNum: customer.phoneNum,
      birthday: customer.birthday
    });

    return res.cookie("token", token, { httpOnly: true, secure: true })
            .json({
              login: true,
              redirect: "/",
              name: customer.cusName,
              id: customer._id,
              email:customer.email
            });
  }else{
    return res.status(400).json({ login: false, message: "User Invalid" });
  }
};

const registerCustomer = async (req, res) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name || !phone) {
    return res.status(403).json({ message: 'missing required input' });
  }
  try {
    const customerExsisted = await Customer.findOne({ email: email });

    if (customerExsisted) {
      return res.status(400).json({ message: 'existed customer, please sign in' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const customer = new Customer({
      email: email,
      cusName:name,
      phoneNum:phone,
      password: hashPassword
    });

    customer.save()
    console.log(customer)
    return res.status(200).json({
      status: "OK",
      register:true,
      message: "Succ",
      data: customer,
      redirect: '/Customer'
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: e.message || "Internal Server Error" });
  }
};

const logout = async (req,res)=>{
  res.clearCookie('token')
  return res.json({logout:true})
}

// CRUD cus
const deleteCus=async(req,res)=>{
  const id=req.params.id
  try{
    const deletedCus=await Customer.findByIdAndDelete(id)
    if(!deletedCus){
      return res.status(404).json({message:'Customer not found'})
    }
    res.status(200).json({message:'Success delete customer'})
  }catch(e){
    return res.status(500).json({message:'Internal server prob'}+e)
  }
}

const updateCus=async(req,res)=>{
  const id=req.params.id
  const newData=req.body
  try{
    const updateCus= await Customer.findByIdAndUpdate(id,newData,{new:true})
    if (!updateCus) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updateCus);
  }catch(e){
    return res.status(500).json({message:'Internal server prob'}+e)
  }
}
// CRUD owner
const deleteOwner=async(req,res)=>{
  const id=req.params.id
  try{
    const deleteOwner=await Owner.findByIdAndDelete(id)
    if(!deleteOwner){
      return res.status(404).json({message:'Customer not found'})
    }
    res.status(200).json({message:'Success delete customer'})
  }catch(e){
    return res.status(500).json({message:'Internal server prob'}+e)
  }
}

const updateOwner=async(req,res)=>{
  const id=req.params.id
  const newData=req.body
  try{
    const updateOwner= await Owner.findByIdAndUpdate(id,newData,{new:true})
    if (!updateOwner) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updateOwner);
  }catch(e){
    return res.status(500).json({message:'Internal server prob'}+e)
  }
}
function validateBirthDate(birthday) {
  const currentDay = new Date();
  const dob = new Date(birthday);
  console.log(dob)
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
  deleteCus,
  updateCus,
  deleteOwner,
  updateOwner,
  //phuc
  loginCustomer,
  registerCustomer,
  logout
};
