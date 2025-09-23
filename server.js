const express = require("express");
const connectDB = require("./connection");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "*", // your frontend URL
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your frontend URL in production
    methods: ["GET", "POST"]
  }
});


// app.get("/", (req, res) => {
//   res.send("Socket.IO Server is running...");
// });

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);

  // Receive message from client
  socket.on("send_message", (data) => {
    socket.join(data);
    // Send to all clients including sender
    io.emit("receive_message", data);
    console.log(`User ID :- ${socket.id} joined room : ${data}`);
  });

  // While typing
  socket.on("typing", (user) => {
    socket.broadcast.emit("typing", user); // send to other clients only
  }); 

       socket.on("send_message",(data)=>{
       socket.to(data.room).emit("receive_message",data)
          })

    socket.on("messageRead", async ({ messageId, room }) => {
      console.log("send message data ", messageId, room) 
    // Update message status in DB
    const updatedMessage = { messageId, room, read: true }
      
    // Notify sender that message is read
      socket.join(room)
      io.to(room).emit("messageReadUpdate", updatedMessage);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});



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
        url: "http://192.168.122.106:5000",
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
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
