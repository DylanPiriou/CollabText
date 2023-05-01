require("dotenv").config();
const mongoose = require("mongoose");
const Document = require("./document");
const Message = require("./message");

mongoose.connect(process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const defaultValue = "";
let users = [];
io.on("connection", socket => {

    console.log(`${socket.id} s'est connecté`)

    socket.on("add-user", ({ username, documentId }) => {
        socket.username = username;
        const user = { username, documentId, socketId: socket.id };
        users.push(user)
        io.to(documentId).emit("user-connected", users);
    });

    socket.on("get-users", documentId => {
        io.emit("load-users", users)
    })

    socket.on("get-document", async documentId => {
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("save-document", async data => {
            console.log({ data })
            await Document.findByIdAndUpdate(documentId, { data });
        })
    })

    socket.on("send-message", data => {
        socket.to(data.room).emit("receive-message", data);
    })

    socket.on("join-room", ({ roomId, documentId }) => {
        // console.log(roomId, documentId)
    });

    socket.on("writting", username => {
        console.log(username)
        socket.broadcast.emit("writting", username);
    })

    socket.on("not-writting", () => {
        console.log("not-writting")
        socket.broadcast.emit("not-writting");
    })

    socket.on("disconnect", () => {
        const disconnectedUser = users.find(user => user.socketId === socket.id);
        if (disconnectedUser) {
            console.log(`${disconnectedUser.username} s'est déconnecté`);
            users = users.filter(user => user.socketId !== socket.id);
            io.emit("user-disconnected", disconnectedUser);
        }
        socket.disconnect();
    });
})

async function findOrCreateDocument(id){
    if(id === null) return;
    const document = await Document.findById(id);
    if(document) return document;
    return await Document.create({ _id: id, data: defaultValue });
}