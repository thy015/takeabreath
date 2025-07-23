const express=require('express')
const {Owner} = require("../../models/signUp.model");
const router=express.Router();

router.post('/createWallet',async(req,res)=>{
    const {ownerID}=req.query
    try{
    const newWallet = await wallet.createWallet();
    console.log(newWallet);
    const ownerIden=await Owner.findById(ownerID)
        if(!ownerIden){
            return res.status(404).json({message:"No such account with this ID"})
        }
        const newCard = {
            paymentMethod: "Wowo",
            cardWoWoID: newWallet.id,
            cardWoWoBalance: newWallet.balance,
        };
        ownerIden.paymentCard.push(newCard);
        await ownerIden.save()
        console.log(ownerIden)
        console.log(newCard)
    return res.status(200).json(ownerIden);
    }catch(e){
        return res.status(500).json({message:`${e.message}`});
    }
});
module.exports = router;

