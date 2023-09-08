const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', apiRoutes);
app.use('/', function (req, res) {
    res.send('Welcome to the API, working');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
