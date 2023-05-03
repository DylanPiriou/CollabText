const connectDB = require("./mongo");
const docSchema = require("./Models/model.document");
const messageSchema = require("./Models/model.message");
const dotenv = require("dotenv").config();

connectDB();

const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const defaultValue = "";
let users = [];

io.on("connection", socket => {
    // Ajouter un utilisateur
    socket.on("add-user", ({ username, documentId }) => {
        socket.username = username;
        socket.docId = documentId;
        console.log(`${socket.username} s'est connecté`)
        const user = { username, documentId, socketId: socket.id };
        users.push(user)
        io.to(documentId).emit("user-connected", users);
    });

    // Récupérer la liste des utilisarteurs connectés
    socket.on("get-users", documentId => {
        const usersInRoom = users.filter(user => user.documentId === documentId);
        io.emit("load-users", usersInRoom);
    });

    // Gérer le document (obtenir/envoyer/sauvegarder les changements)
    socket.on("get-document", async documentId => {
        console.log(documentId)
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document?.data);

        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("save-document", async data => {
            console.log({ data })
            await docSchema.findByIdAndUpdate(documentId, { data });
        })
    })

    socket.on("load-messages", async id => {
        const messages = await messageSchema.find({ room: id });
        console.log(messages)
        socket.emit("display-messages", messages)
    })

    // Envoyer un message à la room + stockage BDD
    socket.on("send-message", data => {
        const message = new messageSchema({
            room: data.room,
            userId: data.userId,
            username: data.username,
            message: data.message
        })
        message.save().then(() => {
            console.log("msg stocké et envoyé au front")
            socket.to(data.room).emit("receive-message", data);
        })
    })

    // Afficher l'utilisateur qui écrit
    socket.on("writting", username => {
        socket.broadcast.emit("writting", username);
    })

    // N'écrit plus
    socket.on("not-writting", () => {
        socket.broadcast.emit("not-writting");
    })

    // Gestion de la déconnexion
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

//  Logique pour récupérer/créer un document dans la base de données
async function findOrCreateDocument(id) {
    if (id === null) return;
    const document = await docSchema.findById(id);
    if (document) return document;
    return await docSchema.create({ _id: id, data: defaultValue });
}