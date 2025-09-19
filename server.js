const express = require("express");
const connectDB = require("./connection");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      version: "1.0.0",
      description: "API documentation for User Management",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./Routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(express.json());
connectDB()
app.use("/auth", require("./Routes/authRoutes"));
app.use("/table-data", require("./Routes/dataRoutes"));


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

