const {WoWoWallet} = require('@htilssu/wowo');
const express=require('express')
const {Owner} = require("../../models/signUp.model");
const router=express.Router();

const wallet = new WoWoWallet(`${process.env.WOWO_SECRET}`,'https://api.wowo.htilssu.id.vn');

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

router.get('/wowoListCard',async(req,res)=>{
        const {ownerID}=req.query
        const owner = await Owner.findById({ _id: ownerID })
        const paymentCard = owner.paymentCard.filter(c=>c.paymentMethod==='Wowo')

        return res.status(200).json({ cards: paymentCard })
})

router.post('/deleteWoWoCard',async(req,res)=>{
    const {ownerID,cardWoWoID}=req.query
    try {
        const owner = await Owner.findById({_id: ownerID})
        const newListPaymentCard = owner.paymentCard.filter(
            (card) => card.cardWoWoID !== parseInt(cardWoWoID)
        );
        owner.set({ paymentCard: newListPaymentCard });
        await owner.save();

        const result = await wallet.deleteWallet(`${cardWoWoID}`);
        if (result === true) {
            return res.status(200).json({message:'Success delete WOWO card'})
        }
        return res.status(400).json({message:'Cant delete wowo card'});
    }catch(e){
        return res.status(500).json({message:`${e.message}`});
    }
})
router.post('/wowoListCard',async(req,res)=>{
    const {ownerID}=req.query
    const owner = await Owner.findById({ _id: ownerID })
    const paymentCard = owner.paymentCard.filter(c=>c.paymentMethod==='Wowo')

    return res.status(200).json({ cards: paymentCard })
})
router.post('/detailWoWoCard',async(req,res)=>{
    const {cardWoWoID}=req.query
    try {
        const walletDetails = await wallet.getWallet(`${cardWoWoID}`);
        return res.status(200).json({message:'Success query WOWO card detail',walletDetails})
    }catch(e){
        return res.status(500).json({message:`${e.message}`});
    }
})
router.post('/transferWoWoMoney', async (req, res) => {
    const { cardWoWoID, amount } = req.query;

    try {
        console.log("Transfer Request:", { cardWoWoID, amount });

        const transferProceed = await wallet.transferMoney(`${cardWoWoID}`, amount);
        console.log("Transfer Proceed:", transferProceed);

        if (transferProceed) {
            // Find the owner with the specific WoWo card
            const owner = await Owner.findOne({
                'paymentCard.cardWoWoID': Number(cardWoWoID)
            });

            if (!owner) {
                return res.status(404).json({ message: 'Owner with specified WoWo card not found' });
            }

            const cardIndex = owner.paymentCard.findIndex(
                (card) => card.cardWoWoID === Number(cardWoWoID)
            );

            if (cardIndex === -1) {
                return res.status(404).json({ message: 'WoWo card not found in owner\'s payment cards' });
            }

            owner.paymentCard[cardIndex].cardWoWoBalance += Number(amount);
            await owner.save();

            return res.status(200).json({
                message: 'Transfer successful',
                transferDetails: transferProceed,
                updatedCard: owner.paymentCard[cardIndex],
            });
        } else {
            return res.status(400).json({ message: 'Error in transferring money' });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: e.message || 'Internal server error' });
    }
});

module.exports = router;

