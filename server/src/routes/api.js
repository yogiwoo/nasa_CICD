const express=require('express')
const planetsRouter = require('./planets/planets');
const launchesRouter=require('./launches/launchesRouter')

const api=express.Router();
api.use('/planets',planetsRouter);
api.use('/launches',launchesRouter);

module.exports=api