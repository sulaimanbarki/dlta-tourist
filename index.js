const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
var cors = require('cors')
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const corsOptions = {
    origin: '*',
};

const app = express();
app.use(cors(corsOptions))


app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));


app.use("/auth", authRouter);
app.use('/api', apiRoutes);
app.use('/', function (req, res) {
    res.send('Welcome to the API, working');
});

connectDB();

const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

mongoose.connection.once("open", () => {
    console.log("DB connected.");
    app.listen(PORT, () => {
        console.log(`Server is listening at port ${PORT}.`);
    });
});

mongoose.connection.once("error", () => {
    console.log("An error has occurred while connecting to the DB.");
});
