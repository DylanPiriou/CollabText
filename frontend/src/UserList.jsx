import React, { useState, useEffect, useRef } from 'react';
import "./UserList.scss";

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
        return (
          <div className="wrapper-user">
            <span key={`logo-${index}`}>{user.username.slice(0, 2)}</span>
            <li key={`name-${index}`}><b>{user.username}</b> est connecté.</li>
          </div>
        )
      })}
    </ul>
  )
}
