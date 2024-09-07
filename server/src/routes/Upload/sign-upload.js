const express = require('express');
const generateSignature = require("./sign-upload.container")


const router = express.Router()

router.post("/",generateSignature)

module.exports = router