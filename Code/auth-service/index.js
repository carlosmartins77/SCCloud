const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 7070;
const jwt = require("jsonwebtoken");
const password = process.env.PASSWORD
const connectDB = require("./moongoDB");
const bodyParser = require('body-parser');
const cors = require('cors');
//const swaggerUi = require('swagger-ui-express')
//const configswagger = require('./swaggerconfig')

// Connect to Data Base
connectDB();

app.use(express.json());
app.use(cors());


app.use("/", require("./routes/authroutes"))
//app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(configswagger))

app.listen(PORT, () => {
    console.log(`Auth-Service at ${PORT}`);
});



//app.use("/", require("./routes/authroutes"))
/*
const consumer = async () => {
    const server = new RabbitmqServer('amqp://admin:admin@rabbitmq:5672');
    await server.start();
    await server.consume('express', (message) => console.log(message.content.toString()));
  }
  
  consumer();*/
  
