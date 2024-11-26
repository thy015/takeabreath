const bcrypt = require("bcrypt");
const { Owner, Admin, Customer} = require("../../models/signUp.model");
const { generalAccessTokens } = require("../../middleware/jwt");
const dotenv = require("dotenv");
dotenv.config();
//owner
const signUpOwner = async (req, res) => {

  const { name, password, email, birthday, phone, idenCard } =
    req.body;


  if (!name || !password || !email || !phone || !idenCard) {

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
      ownerName: name,
      password: hashPassword,
      email: email,
      phoneNum: phone,
      idenCard: idenCard
    });

    await createdOwner.save()
    // Respond with success
    return res.status(200).json({
      status: "OK",
      register: true,
      message: "Succ",
      data: createdOwner,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
};

//chung của owner và admin
const signInOwner = async (req, res) => {
  const { email, password } = req.body
  console.log({ email, password })
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
        name: foundOwner.ownerName,
        birthday: foundOwner.birthday,
        phoneNum: foundOwner.phoneNum,
        avatarLink: foundOwner.avatarLink,
        regDay: foundOwner.regDay,
        role:'owner',
      });

      return res.status(200).cookie("token", access_token, { httpOnly: true, secure: true,sameSite:"none" }).json({
        login: true,
        role:'owner',
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
    console.log(foundAdmin)
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
        email: foundAdmin.email,
        role:'admin',
      });

      return res.status(200).cookie("token", access_token, { httpOnly: true, secure: true ,sameSite:"none"}).json({
        status: "OK",
        message: "Admin logged in",
        access_token: access_token,
        name: foundAdmin.adminName,
        id: foundAdmin._id,
        login: true,
        role:'admin',
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
    if (customer.isActive === false) {
      return res.status(401).json({ login: false, message: `Tài khoản đã bị khóa vì: ` + customer.reasonInact + `   Liên hệ mở khóa tại: thymai.1510@gmail.com` });
    }
    const isCorrectPass = await bcrypt.compare(password, customer.password);
    if (!isCorrectPass) {
      return res.status(401).json({ login: false, message: "Password incorrect" });
    }

    const token = await generalAccessTokens({
      id: customer._id,
      name: customer.cusName,
      email: customer.email,
      phoneNum: customer.phoneNum,
      birthday: customer.birthday,
      role:'customer',
    });

    return res.cookie("token", token, { httpOnly: true, secure: true ,sameSite:"none"})
      .json({
        login: true,
        role:'customer',
        redirect: "/",
        name: customer.cusName,
        id: customer._id,
        email: customer.email
      });
  } else {
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
      cusName: name,
      phoneNum: phone,
      password: hashPassword
    });

    customer.save()
    console.log(customer)
    return res.status(200).json({
      status: "OK",
      register: true,
      message: "Succ",
      data: customer,
      role:'customer',
      redirect: '/Customer'
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: e.message || "Internal Server Error" });
  }
};
// oggy user
const loginWithSSO = async (req, res) => {
  const { decodedToken } = req.body

  if(!decodedToken){
    return res.status(403).json({message: 'missing token in signUp controller'})
  }
  console.log(decodedToken)
  if(decodedToken.role === "user"){

    const customerExsisted = await Customer.findOne({
      email:decodedToken.email
    })
    if(!customerExsisted){
      const newCus = await Customer.create({
        cusName:`${decodedToken.firstName} ${decodedToken.lastName}`,
        email:decodedToken.email,
        ssoID: decodedToken.userId,
        createdAt: decodedToken.createdAt,
        birthday:decodedToken.dob
      })
      // system token
      const token = await generalAccessTokens({
        id:newCus._id,
        name: newCus.cusName,
        email: newCus.email,
        ssoID:newCus.ssoID
      })

      console.log("[SYS TOKEN CUSTOMER]",token)
      return res.cookie("token", token, { httpOnly: true, secure: true,sameSite:"none" })
          .json({
            login: true,
            role:'customer',
            id:newCus._id,
            name: newCus.cusName,
            email: newCus.email,
            ssoID:newCus.ssoID
          })
    }else{
      // already log
      const token = await generalAccessTokens({
        id:customerExsisted._id,
        name: customerExsisted.cusName,
        email: customerExsisted.email,
        ssoID:customerExsisted.ssoID
      })

      console.log("[SYS TOKEN CUSTOMER]",token)
      return res.cookie("token", token, { httpOnly: true, secure: true,sameSite:"none" })
          .json({
            login: true,
            role:'customer',
            id:customerExsisted._id,
            name: customerExsisted.cusName,
            email: customerExsisted.email,
            ssoID:customerExsisted.ssoID
          })
    }
  }
}
// oggy partner
const strictSignInPartner=async(req,res)=>{
  const {token,phoneNum,idenCard} = req.body
  console.log(token)
  if(!token){
    return res.status(403).json({message: 'missing token in signUp controller'})
  }
  const existedPartner=await Owner.findOne({ssoID:token.partnerId})
  if(!existedPartner){
    const newPartner=await Owner.create({
      ownerName:`${token.firstName} ${token.lastName}`,
      email:token.email,
      ssoID: token.partnerId,
      createdAt: token.createdAt,
      phoneNum:phoneNum,
      idenCard:idenCard,
    })
    const newToken = await generalAccessTokens({
      id:newPartner._id,
      name: newPartner.ownerName,
      email: newPartner.email,
      ssoID:newPartner.ssoID
    })
    console.log(newToken)
    return res.status(200).cookie('token',newToken,{httpOnly:true,secure:true,sameSite:"none"})
        .json({
          login: true,
          role:'owner',
          id:newPartner._id,
          name: newPartner.ownerName,
          email: newPartner.email,
          ssoID:newPartner.ssoID
        })
  }
  return res.status(400).json({message:'Cus sign up before'})
}

const checkExistedPartner=async(req,res)=>{
  const {decodedToken}=req.body
  if(!decodedToken){
    return res.status(403).json({message: 'missing token in signUp controller'})
  }
  const existedPartner=await Owner.findOne({ssoID:decodedToken.partnerId})
  if(existedPartner){
    const newToken = await generalAccessTokens({
      id:existedPartner._id,
      name: existedPartner.ownerName,
      email: existedPartner.email,
      ssoID:existedPartner.ssoID,
      role:'owner',
    })
    return res.status(200).cookie('token',newToken,{httpOnly:true,secure:true,sameSite:"none"})
        .json({
          login: true,
          role:'owner',
          id:existedPartner._id,
          name: existedPartner.ownerName,
          email: existedPartner.email,
          ssoID:existedPartner.ssoID
        })
  }
  return res.status(202).json({message:'Partner not existed yet'})

}
const logout = async (req, res) => {
  const link = process.env.BE_PORT
  const domain = link.substring(8,link.length)
  console.log("[LINK]",link)
  console.log("[DOMAIN]",domain)
  console.log("[Token sso]", req.cookies.Token)
  try{
    res.clearCookie('token',{ path: '/', domain: domain,secure: true}).json({ logout: true,message:"Delete token" })
  }catch(err){
    return res.json({ logout: err.message })
  }
 
}

// CRUD cus
const deleteCus = async (req, res) => {
  const id = req.params.id
  try {
    const deletedCus = await Customer.findByIdAndDelete(id)
    if (!deletedCus) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    res.status(200).json({ message: 'Success delete customer' })
  } catch (e) {
    return res.status(500).json({ message: 'Internal server prob' } + e)
  }
}

const updateCus = async (req, res) => {
  const id = req.params.id
  const newData = req.body
  try {
    const updateCus = await Customer.findByIdAndUpdate(id, newData, { new: true })
    if (!updateCus) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updateCus);
  } catch (e) {
    return res.status(500).json({ message: 'Internal server prob' } + e)
  }
}
// CRUD owner
const deleteOwner = async (req, res) => {
  const id = req.params.id
  try {
    const deleteOwner = await Owner.findByIdAndDelete(id)
    if (!deleteOwner) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    res.status(200).json({ message: 'Success delete customer' })
  } catch (e) {
    return res.status(500).json({ message: 'Internal server prob' } + e)
  }
}

const insertCartOwner = async (req, res) => {
  const ownerID = req.ownerID
  if (!ownerID)
    return res.status(403).json({ message: "Bị mất dữ liệu người dùng !" })
  const { numberCard, cvv, expDay } = req.body

  if (!numberCard || !cvv || !expDay)
    return res.status(403).json({ message: "Bị mất dữ liệu thẻ !" })

  try {
    const owner = await Owner.findById({ _id: ownerID })
    const paymentCard = owner.paymentCard
    const checkExistedCard = paymentCard.filter(item => item.cardNumber === numberCard)
    console.log("[checkExistedCard]", checkExistedCard)
    if (checkExistedCard.length > 0) {
      return res.status(400).json({ message: "Số thẻ đã được tạo !" })
    }

    const newCards = [...paymentCard, {
      paymentMethod: "Visa",
      cardNumber: numberCard,
      cardCVV: cvv,
      cardExpiration: expDay
    }]
    owner.set({
      paymentCard: newCards
    })

    await owner.save()
    return res.status(200).json({ message: "Thêm thẻ thành công", cards: newCards })
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

}

const deleteCardOwner = async (req, res) => {
  const ownerID = req.ownerID
  const { numberCard } = req.body
  const owner = await Owner.findById({ _id: ownerID })
  const paymentCard = owner.paymentCard
  const newPaymentCard = paymentCard.filter(item => item.cardNumber !== numberCard)

  owner.set({
    paymentCard: newPaymentCard
  })

  await owner.save()
  return res.status(200).json({ message: "Xóa thẻ thành công", cards: newPaymentCard })
}

const getListCard = async (req, res) => {
  const ownerID = req.ownerID
  const owner = await Owner.findById({ _id: ownerID })
  const paymentCard = owner.paymentCard.filter(c=>c.paymentMethod==='Visa')

  return res.status(200).json({ cards: paymentCard })
}

const updateOwner = async (req, res) => {
  const id = req.params.id
  const newData = req.body
  console.log(newData)
  try {
    const updateOwner = await Owner.findByIdAndUpdate(id, newData, { new: true })
    if (!updateOwner) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updateOwner);
  } catch (e) {
    return res.status(500).json({ message: 'Internal server prob' } + e)
  }
}

const updateOnwerPhuc = async (req,res)=>{
  const id = req.params.id
  const newData = req.body.newData

  try {
    const updateOwner = await Owner.findByIdAndUpdate(id, newData, { new: true })
    if (!updateOwner) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(updateOwner);
  } catch (e) {
    return res.status(500).json({ message: 'Internal server prob' } + e)
  }
}
function validateBirthDate(birthday) {
  const currentDay = new Date();
  const dob = new Date(birthday);
  console.log(dob)
  let age = currentDay.getFullYear() - dob.getFullYear();
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
  deleteCus,
  updateCus,
  deleteOwner,
  updateOwner,
  insertCartOwner,
  getListCard,
  strictSignInPartner,
  deleteCardOwner,
  checkExistedPartner,
  //phuc
  loginCustomer,
  registerCustomer,
  logout,
  loginWithSSO,
  updateOnwerPhuc
};
