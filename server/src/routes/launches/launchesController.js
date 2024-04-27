const {getAllLaunches,addNewLaunch,scheduleNewLaunch,existsLaunchWithId, abortLaunchById}=require('../../models/launchesModel');
const {getPagination}=require('./../../services/query')
async function httpGetAllLaunches(req,res){
    //console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++",launches)
    
    const {skip,limit}=getPagination(req.query)
    const launches=await getAllLaunches(skip,limit)
    return res.status(200).json(launches);
}



async function httpAddNewLaunch(req,res){
    
    const launch =req.body;
    if(!launch.mission||!launch.rocket||!launch.launchDate||!launch.target){
        return res.status(400).json({message:"Missing required field"})
    }
    launch.launchDate=new Date(launch.launchDate);
    if(isNaN(launch.launchDate)==='Invalid Date'){
        return res.status(400).json({message:"invalid launch data"})
    }
    await scheduleNewLaunch(launch);
    res.status(201).json({message:"launch added",launch})
}

async function httpAbortLaunch(req,res){
    const launchId= parseInt(req.params.id);
    const existsLaunch=await existsLaunchWithId(launchId)
    if(!existsLaunch){
        return res.status(404).json({
            error:"launch not found"
        });

    }
    const aborted=await abortLaunchById(launchId);
    if(!aborted){
        return res.status(400).json({
            error:"launch not aborted"
        })
    }
    return res.status(200).json({
        ok:true
    })

}
module.exports={
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}