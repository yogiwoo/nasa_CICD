const mongoose=require('mongoose')
const MONGO_URL=process.env.MONGO
mongoose.connection.on('open',()=>{
    console.log("MongoDB connection redy");
})

mongoose.connection.on("error",(err)=>{
    console.log("error",err)
})

async function mongoConnect(){
    await mongoose.connect(MONGO_URL,{
        // newUrlParser:true,
        // useFindAndModify:false,
        // useCreateIndex:true,
        // useUnifiedTopology:true
   })
}

async function mongoDisconnect(){
    await mongoose.disconnect()
}

module.exports={mongoConnect,mongoDisconnect}