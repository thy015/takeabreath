const express = require('express');
const reqCancelRouter = express.Router();
const reqCancelController=require('./cancelReq.controller');
const { authenCusToken, authenAdminToken } = require('../../services/jwt');

reqCancelRouter.get('/processing',reqCancelController.getReqCancelRoomProcess)
reqCancelRouter.get('/accepted',reqCancelController.getReqCancelRoomAccepted)
reqCancelRouter.get('/rejected',reqCancelController.getReqCancelRoomRejected)

reqCancelRouter.post('/cusSend',authenCusToken,reqCancelController.reqCancelRoom)
reqCancelRouter.post('/admin/accept/:reqCancelID',authenAdminToken,reqCancelController.handleCancelRoomAccept)
reqCancelRouter.post('/admin/reject/:reqCancelID',authenAdminToken,reqCancelController.handleCancelRoomReject)
module.exports=reqCancelRouter
