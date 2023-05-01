import React, { useState, useEffect, useRef } from 'react';
import "./UserList.scss";
import { RxChevronRight } from "react-icons/rx";
import { RxChevronDown } from "react-icons/rx";

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
    setOnlineMessage(onlineUsers.length > 1 ? "utilisateurs connectés" : "utilisateur connecté");

  }, [onlineUsers])

  // Logique ouverture/fermeture de la collapse
  const [isOpen, setIsOpen] = useState(false);
  const handleCollapse = () => {
    setIsOpen(!isOpen);
  }

  const randonColor = () => {
    // Couleurs comprises entre 100 et 250
    const red = Math.floor(Math.random() * 100 + 150);
    const green = Math.floor(Math.random() * 100 + 150);
    const blue = Math.floor(Math.random() * 100 + 150);

    const color = `rgb(${red}, ${green}, ${blue})`;
    return color;
  }

  return (
    <div className="online-container" onClick={() => handleCollapse()}>
      <div className="header-collapse">
        <span className="online-logo"></span>
        <h2>{onlineUsers.length} {onlineMessage}</h2>
        {!isOpen ? <RxChevronRight/> : <RxChevronDown/>}
      </div>
      {isOpen && (
        <ul className="users-wrapper">
          {onlineUsers && onlineUsers.map((user, index) => {
            return (
              <li className="user" key={`connectedUser-${index}`}>
                <span className="logo" style={{background: randonColor()}}>{user?.username?.slice(0, 2)}</span>
                <span className="data"><b>{user.username}</b> est connecté.</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
