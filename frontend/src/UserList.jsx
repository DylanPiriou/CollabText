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
        })

        socket.on("user-disconnected", data => {
          console.log(data);
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

  const [onlineMessage, setOnlineMessage] = useState("")
  useEffect(() => {
    setOnlineMessage(onlineUsers.length > 1 ? "Utilisateurs connectés" : "Utilisateur connecté");
  }, [onlineUsers])

  return (
    <ul>
    <h2>{onlineMessage} : {onlineUsers.length}</h2>
      {onlineUsers && onlineUsers.map((user, index) => {
        return (
          <div className="wrapper-user" key={`connectedUser-${index}`}>
            <span>{user?.username?.slice(0, 2)}</span>
            <li><b>{user.username}</b> est connecté.</li>
          </div>
        )
      })}
      {/* {offlineUsers && offlineUsers.map((user, index) => {
        return (
          <div className="wrapper-user" key={`disconnectedUser-${index}`}>
            <span>{user?.slice(0, 2)}</span>
            <li><b>{user}</b> est déconnecté.</li>
          </div>
        )}
      )} */}
    </ul>
  )
}
