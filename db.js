const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://izzakhan8357:maniking@cluster0.ukofm8p.mongodb.net/cloudbook-backend?retryWrites=true&w=majority&appName=Cluster0";
const connectionAlert = ()=>{
    console.log("mongoDB connected successfully 😍")
};
const mongoConnection = ()=>{
    mongoose.connect(mongoURI, connectionAlert());
};

module.exports = mongoConnection;