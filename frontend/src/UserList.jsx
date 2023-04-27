import React, { useState, useEffect } from 'react'

export default function UserList({ socket, documentId }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Ajoute le nouvel utilisateur en ligne lorsqu'il se connecte
  useEffect(() => {
      socket.on("user-connected", user => {
          console.log("Un utilisateur s'est connecté", user)
          setOnlineUsers((prevUsers) => [...prevUsers, user])
          console.log(onlineUsers)
        });

        return () => {
          socket.off("user-connected");
        };
      }, [socket])

  // Renvoie la liste des utilisateurs connectés au groupe
  useEffect(() => {
    socket.on("load-users", users => {
      console.log("Utilisateurs actuellement connectés: ", users);
      setOnlineUsers(users);
    })

    return () => {
      socket.off("load-users");
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("get-users", documentId)
  }, [documentId])

  return (
    <ul>
      {onlineUsers.map((user, index) => {
        return <li key={index}>{user.name} s'est connecté !</li>
      })}
    </ul>
  )
}
