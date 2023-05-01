import React, { useState, useEffect, useRef } from 'react';
import "./UserList.scss";

export default function UserList({ socket, documentId }) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);

  // Ajoute le nouvel utilisateur en ligne lorsqu'il se connecte
  useEffect(() => {

    socket.on("user-connected", user => {
      setOnlineUsers(prevOnlineUsers => [...prevOnlineUsers, user]);
    });

    socket.emit("get-users", documentId);

    socket.on("load-users", users => {
      console.log("Utilisateurs actuellement connectés: ", users);
      setOnlineUsers(users);
      setOfflineUsers(prev => prev.filter(user => !users.includes(user)))
    })

    socket.on("user-disconnected", data => {
      setOfflineUsers(prevOfflineUsers => [...prevOfflineUsers, data.username]);
      setOnlineUsers(prevOnlineUsers =>
        prevOnlineUsers.filter(user => user.socketId !== data.socketId)
      );
    })


    return () => {
      socket.off("user-connected");
      socket.off("load-users");
      socket.off("user-disconnected");
    };
  }, [])

  // Logique pour le titre "Utilisateurs connectés"
  const [onlineMessage, setOnlineMessage] = useState("")
  useEffect(() => {
    setOnlineMessage(onlineUsers.length > 1 ? "Utilisateurs connectés" : "Utilisateur connecté");

  }, [onlineUsers])

  // Logique ouverture/fermeture de la collapse
  const [isOpen, setIsOpen] = useState(false);
  const handleCollapse = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="online-container" onClick={() => handleCollapse()}>
      <div className="header-collapse">
        <span className="online-logo"></span>
        <h2>{onlineMessage} : {onlineUsers.length}</h2>
      </div>
      {isOpen && (
        <ul className="users-wrapper">
          {onlineUsers && onlineUsers.map((user, index) => {
            return (
              <li className="user" key={`connectedUser-${index}`}>
                <span className="logo">{user?.username?.slice(0, 2)}</span>
                <span className="data"><b>{user.username}</b> est connecté.</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
