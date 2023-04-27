// Création du serveur Socket.io qui écoute sur le port 3001
// Paramètrage de cors pour autoriser l'accès au serveur de localhost:5173 avec les méthodes GET & POST
const io = require("socket.io")(3001, {
    cors : {
        origin : "http://localhost:5173",
        methods : ["GET", "POST"]
    }
});

// Evènement "connection" qui se déclanche à chaque fois que quelqu'un se connecte au serveur
// Lors de l'évènement "get-document", on ajoute le socket du client à la room qui correspond à documentId + charge les données du document + est à l'écoute des changements du document pour les envoyer aux autre sockets connectés
const users = [];
io.on("connection", socket => {
    socket.on("add-user", ({ name, documentId }) => {
        const user = { name, documentId, socketId: socket.id };
        console.log(user)
        users.push(user);
        console.log(users)
        io.emit("user-connected", user);
      });

      
    socket.on("get-document", documentId => {
        const data = "";
        socket.join(documentId);
        socket.emit("load-document", data);
        socket.on("send-changes", delta => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })
    })
})