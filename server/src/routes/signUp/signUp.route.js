const express = require("express");
const signUpController = require("./signUp.controller");
const signUpRouter = express.Router();
const {Owner,Customer}=require('../../models/signUp.model');
const { verifyLogin, verifyAdmin } = require("../../services/verify");
// CRUD Owner
signUpRouter.get("/owner", async (req, res) => {
  try {
    const RegOwner = await Owner.find();
    res.status(200).json(RegOwner);
  } catch (e) {
    res.status(500).json(e);
  }
});
signUpRouter.delete('/owner/:id',signUpController.deleteOwner)
signUpRouter.put('/owner/:id',signUpController.updateOwner)

signUpRouter.post("/signUpOwner", signUpController.signUpOwner);
signUpRouter.post("/signInOwner", signUpController.signInOwner);
// CRUD Cus
signUpRouter.get("/customer", async (req, res) => {
  try {
    const RegOwner = await Customer.find();
    res.status(200).json(RegOwner);
  } catch (e) {
    res.status(500).json(e);
  }
});
signUpRouter.delete('/customer/:id',signUpController.deleteCus)
signUpRouter.put('/customer/:id',signUpController.updateCus)

signUpRouter.post("/signInCus", signUpController.loginCustomer);
signUpRouter.post("/signUpCus", signUpController.registerCustomer);
signUpRouter.get('/logout',signUpController.logout)

signUpRouter.get('/verifyAdmin',verifyAdmin,(req,res)=>{
  return res.json(req.user)
})

signUpRouter.get('/verify',verifyLogin,(req,res)=>{
  return res.json(req.user)
})

module.exports = signUpRouter;


/**
 * @swagger
 * tags:
 *   name: Owners
 *   description: Owner management
 */

/**
 * @swagger
 * /api/auth/owner:
 *   get:
 *     summary: Get all owners
 *     tags: [Owners]
 *     responses:
 *       200:
 *         description: A list of owners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Owner'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/owner/{id}:
 *   delete:
 *     summary: Delete an owner
 *     tags: [Owners]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the owner to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Owner deleted successfully
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update an owner
 *     tags: [Owners]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the owner to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerName:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               idenCard:
 *                 type: string
 *     responses:
 *       200:
 *         description: Owner updated successfully
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/signUpOwner:
 *   post:
 *     summary: Sign up a new owner
 *     tags: [Owners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ownerName
 *               - password
 *               - email
 *               - birthday
 *               - phone
 *               - idenCard
 *             properties:
 *               ownerName:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               phone:
 *                 type: string
 *               idenCard:
 *                 type: string
 *     responses:
 *       201:
 *         description: Owner registered successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/signInOwner:
 *   post:
 *     summary: Sign in an owner
 *     tags: [Owners]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Owner logged in successfully
 *       403:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /api/auth/customer:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: A list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/customer/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the customer to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the customer to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phoneNum:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/signUpCus:
 *   post:
 *     summary: Sign up a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/signInCus:
 *   post:
 *     summary: Sign in a customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer logged in successfully
 *       403:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Log out a customer
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

/**
 * @swagger
 * /api/auth/verifyAdmin:
 *   get:
 *     summary: Verify admin
 *     tags: [Owners]
 *     responses:
 *       200:
 *         description: Admin verified successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify logged-in user
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: User verified successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Owner:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         ownerName:
 *           type: string
 *         email:
 *           type: string
 *         phoneNum:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *         regDay:
 *           type: string
 *           format: date-time
 *     Customer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         phoneNum:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 */
