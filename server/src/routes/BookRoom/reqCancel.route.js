const express = require('express');
const reqCancelRouter = express.Router();
const reqCancelController=require('./reqCancel.controller');
const { authenCusToken, authenAdminToken } = require('../../services/jwt');
const services=require('../../services/services')
reqCancelRouter.get('/processing',reqCancelController.getReqCancelRoomProcess)
reqCancelRouter.get('/accepted',reqCancelController.getReqCancelRoomAccepted)
reqCancelRouter.get('/rejected',reqCancelController.getReqCancelRoomRejected)

reqCancelRouter.post('/cusSend',authenCusToken,reqCancelController.reqCancelRoom)
reqCancelRouter.post('/admin/accept/:reqCancelID',authenAdminToken,services.handleCancelRoomAccept)
reqCancelRouter.post('/admin/reject/:reqCancelID',authenAdminToken,services.handleCancelRoomReject)
module.exports=reqCancelRouter
