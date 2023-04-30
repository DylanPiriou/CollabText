import React, { useState, useEffect } from 'react';
import "./Header.scss";
import UserList from './UserList';
import Chat from './Chat';

export default function Header({ socket, username, documentId }) {

    // Gestion du message en fonction de l'heure de la journée
    const [hello, setHello] = useState("");
    useEffect(() => {
        const date = new Date();
        const hour = date.getHours();

        switch (true) {
            case hour < 13:
                setHello("Bonjour");
                break;
            case hour < 18:
                setHello("Bon après-midi");
                break;
            default:
                setHello("Bonjour");
                break;
        }
    }, [])

    return (
        <header>
            <h1>{hello} {username} !😁</h1>
            <UserList socket={socket} documentId={documentId} />
            <Chat username={username} socket={socket} documentId={documentId} />
        </header>
    )
}
