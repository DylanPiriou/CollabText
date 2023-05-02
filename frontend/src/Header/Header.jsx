import React, { useState, useEffect } from "react";
import "./Header.scss";
import UserList from "../UserList/UserList";
import Chat from "../Chat/Chat";

export default function Header({ socket, username, documentId }) {
  // Gestion du message en fonction de l'heure de la journée
  const [hello, setHello] = useState("");

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();

    setHello(hour < 13 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir");
  }, []);

  return (
    <header>
      <h1>
        {hello} {username} !😁
      </h1>
      <UserList socket={socket} documentId={documentId} />
      <Chat username={username} socket={socket} documentId={documentId} />
    </header>
  );
}
