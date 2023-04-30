// Création du serveur Socket.io qui écoute sur le port 3001
// Paramètrage de cors pour autoriser l'accès au serveur de localhost:5173 avec les méthodes GET & POST
const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Evènement "connection" qui se déclanche à chaque fois que quelqu'un se connecte au serveur
// Lors de l'évènement "get-document", on ajoute le socket du client à la room qui correspond à documentId + charge les données du document + est à l'écoute des changements du document pour les envoyer aux autre sockets connectés
let users = [];
io.on("connection", socket => {

    console.log(`${socket.id} s'est connecté`)

    socket.on("add-user", ({ username, documentId }) => {
        const user = { username, documentId, socketId: socket.id };
        users.push(user)
        io.to(documentId).emit("user-connected", users);
    });

    socket.on("get-users", documentId => {
        io.emit("load-users", users)
    })

    socket.on("get-document", documentId => {
        const data = "";
        socket.join(documentId);
        socket.emit("load-document", data);
        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
    })

    socket.on("send-message", data => {
        socket.to(data.room).emit("receive-message", data);
    })

    socket.on("join-room", ({ roomId, documentId }) => {
        console.log(roomId, documentId)
    });

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