const express=require('express');
const{
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}=require('./launchesController');
//const { httpAbortLaunch } = require('../../../../client/src/hooks/requests');
const launchesRouter=express.Router();
launchesRouter.get('/',httpGetAllLaunches)
launchesRouter.post('/',httpAddNewLaunch)
launchesRouter.delete('/:id',httpAbortLaunch)
module.exports=launchesRouter;