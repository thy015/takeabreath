const {WoWoWallet} = require('@htilssu/wowo');
const express=require('express')
const router=express.Router();

const wallet = new WoWoWallet(`${process.env.WOWO_SECRET}`,'https://api.wowo.htilssu.id.vn');
router.post('/createWallet',async(req,res)=>{
    try{
    const newWallet = await wallet.createWallet();
    return res.status(200).json(newWallet);
    }catch(e){
        return res.status(500).json({message:`${e.message}`});
    }
});

module.exports = router;

