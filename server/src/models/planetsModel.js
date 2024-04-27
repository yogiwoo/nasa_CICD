const planetsModel=require('./planetsMongo');
const fs = require('fs');
const path=require('path')
const {parse} = require('csv-parse');




function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}


function  loadPlanetsData(){  
  return new Promise (( res,rej)=>{
    fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
    .pipe(parse({
    comment: '#',
    columns: true,
  }))
  .on('data', async (data) => {
    if (isHabitablePlanet(data)) {
      savePlanet(data);
    }
  })
  .on('error', (err) => {
    console.log(err);
    rej(err);
  })
  .on('end',async  () => {
    // console.log(habitablePlanets.map((planet) => {
    //   return planet['kepler_name'];
    // }));
    console.log("+++++++++++++++++++++++++++++++++++++++++",await getAllPlanets())
    const countPlanetsFound=await getAllPlanets()
    const nosOfPlanet=countPlanetsFound.length;
    console.log(`${nosOfPlanet} habitable planets found!`);
    res();
  });
})
}

async function getAllPlanets(){
  console.log("apifunction invoked")

  const planets= await planetsModel.find({});
  console.log(planets)
  return planets
}

 async function savePlanet(planet){
  console.log('save planet')
  try{
    await planetsModel.updateOne({
      keplerName:planet.kepler_name
     },{
      keplerName:planet.kepler_name
     },{
      upsert:true
     });
  }catch(error){
    console.log("could not save planet",error)
  }
}

  module.exports={
    loadPlanetsData,
    getAllPlanets
  }