import React, { useState, useRef } from 'react';
import "./Modal.scss";

export default function Modal({ socket, username, setUsername, handleKeyPress }) {

    const input = useRef();
    const [roomId, setRoomId] = useState("");

    // Logique lorsqu'on valide le pseudo
    const handleRoom = () => {
        socket.emit("join-room", { roomId, documentId })
    }

    return (
        <form className="modal">
            <h2>Entrez un pseudo</h2>
            <input type="text" name="" id="" placeholder="ex. Mozart" onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} value={username} ref={input} />
            <h2>Entrez l'ID de groupe</h2>
            <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyDown={e => { e.key === "Enter" && handleRoom() }} />
        </form>
    )
}
