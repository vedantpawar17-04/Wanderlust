const mongoose = require('mongoose');
const initData=require("./data.js");
const Listing = require('../models/listing.js');

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log('Connected To MongoDB');
}).catch((err)=>{
    console.error('Error Connecting To MongoDB',err);
})

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) => ({ ...obj, owner: '674be0f7dae8db87f8b775e4' }));
    await Listing.insertMany(initData.data);
    console.log('Database Initialized');
}
initDB();