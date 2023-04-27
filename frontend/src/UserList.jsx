import React, { useState, useEffect } from 'react'

export default function UserList({ socket, documentId }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Ajoute le nouvel utilisateur en ligne lorsqu'il se connecte
  useEffect(() => {

      socket.on("user-connected", user => {
          setOnlineUsers(user)
        });

        socket.on("load-users", users => {
          console.log("Utilisateurs actuellement connectés: ", users);
          setOnlineUsers(users);
        })

        socket.emit("get-users", documentId)

        return () => {
          socket.off("user-connected");
          socket.off("load-users");
        };
      }, [])

  useEffect(() => {
    socket.on("")
  }, [])

  return (
    <ul>
      {onlineUsers.map((user, index) => {
        return <li key={index}>{user.name} est connecté.</li>
      })}
    </ul>
  )
}
