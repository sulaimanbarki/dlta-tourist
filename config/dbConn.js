const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb://sulaimanbarki:AgkQHEYRAJbPKpWb@ac-zv8o9um-shard-00-00.wsfafqg.mongodb.net:27017,ac-zv8o9um-shard-00-01.wsfafqg.mongodb.net:27017,ac-zv8o9um-shard-00-02.wsfafqg.mongodb.net:27017/?ssl=true&replicaSet=atlas-8uo05a-shard-0&authSource=admin&retryWrites=true&w=majority"
        );
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;
