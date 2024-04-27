const launchesDB=require('./launchesMongo');
const axios = require('axios')
const planets=require('./planetsMongo')
const launches=new Map();
let DEFAULT_FLIGHT_NUMBER=100;
// const launch ={
//     flightNumber:100, //flight_number
//     mission:'Kepler Exploration X', //name
//     rocket:'Explorer IS1',//rocket.name
//     launchDate:new Date('December 27,2030'),//date_local
//     target:'Kepler-442 b',//
//     customer:['ZTM','NASA','ISRO'],//payload.customers for each payload
//     upcoming:true,//upcoming
//     success:true//success
// };

// saveLaunch(launch);

// launches.set(launch.flightNumber,launch)

const spacex_api_url='https://api.spacexdata.com/v4/launches/query '

async function populateLaunches(){
    const response=await axios.post(spacex_api_url,{
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                path:"rocket",
                select:{
                    name:1
                }
            },
            {
                path:"payloads",
                select:{
                    customers:1
                }
            }
            ],
            
        }
    });

    if(response.status !==200){
        console.log("Problem downlaid launch data")
        throw new Error("Launch data downlaod failed")
    }



    const launchDocs=response.data.docs;
    for(const launchDoc of launchDocs){

        const payload=launchDoc['payloads'];
        const customers=payload.flatMap((payload)=>{
            return payload['']
        })
        const launch={
        flightNumber:launchDoc['flight_number'],
        mission:launchDoc['name'],
        rocket:launchDoc['rocket']['name'],
        launchDate:launchDoc['date_local'],
        upcoming:launchDoc['upcoming'],
        success:launchDoc['success'],
        customers
        }
        console.log(`${launch.flightNumber} ${launch.mission}`)
        //populate launches collection
        await saveLaunch(launch);
    }
}

async function loadLaunchData(){

    const firstLaunch=await findLaunch({
        flightNumber:1,
        rocket:'Falcon 1',
        mission:'FalconSat'
    })

    if(firstLaunch){
        console.log('launch data already loaded');
        return;
    }
    else{
        await populateLaunches()
    }


   
}


async function getLatestFlightNumber(){
    const latestFlightNumber=await launchesDB.findOne().sort('-flightNumber')
    if(!latestFlightNumber){
        return DEFAULT_FLIGHT_NUMBER
    }
    const flightNo=latestFlightNumber.flightNumber
    return flightNo
}
async function getAllLaunches(skip,limit){
    return await launchesDB.find({upcoming:true},{_id:0,__v:0}).sort({flightNumber:-1}).skip(skip).limit(limit)
}


async function saveLaunch(launch){
   
    await launchesDB.findOneAndUpdate({
        flightNumber:launch.flightNumber,
    },launch,{
        upsert:true
    })
}

async function findLaunch(filter){
    return await launchesDB.findOne(filter)
}

async function existsLaunchWithId(launchId){
   // return await launchesDB.find({flightNUmber:launchId});

   return await findLaunch({
    flightNumber:launchId
   })
}

// function addNewLaunch(launch){
//     console.log("_______________",launch);
//     console.log("hi this is new launch")
//     latestFlightNumber++;
//     launches.set(latestFlightNumber,
//         Object.assign(launch,{
//             success:true,
//             upcoming:true,
//             customer:['ztm','nasa'],
//             flightNumber:latestFlightNumber
//         })
//         );
// }

async function scheduleNewLaunch(launch){
     console.log("===================",launch.target)
    const planet=await planets.findOne({
        keplerName:launch.target
    });
    console.log("+++++++++++++++++++++++",planet)
    if(!planet){
        throw new Error('No matching planets found')
    }
    const newFlightNumber=await getLatestFlightNumber()+1
    const addNewLaunch=Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['isro','nasa','roscosmos'],
        flightNumber:newFlightNumber
    })
    console.log("++++++++++++++++++++++ a",addNewLaunch)
    await saveLaunch(addNewLaunch)
}
async function abortLaunchById(launchId) {
    const aborted=await launchesDB.updateOne({
        flightNumber:launchId,
    },{upcoming:false,success:false})

    return aborted.ok===1 && aborted.nModified===1
}

module.exports={
    loadLaunchData,
    getAllLaunches,
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch,
    
}