const http=require('http');
require('dotenv').config()
const app=require('./app')
const mongoose=require('mongoose')
const {loadPlanetsData}=require('./models/planetsModel')
const {loadLaunchData}=require('./models/launchesModel')
const {mongoConnect}=require("./../src/services/mongo")
const PORT=process.env.PORT||8000;


const server=http.createServer(app)


async function startServer(){
   await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT,()=>{
        console.log(`listinign on port ${PORT}`)
    })
}

startServer();


