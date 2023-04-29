import React, { useEffect, useRef, useState } from "react";

export default function Chat({ username, socket, documentId }) {
    const [isOpen, setIsOpen] = useState(true);
    const btn = useRef();
    const input = useRef();
    const handleBox = () => {
        setIsOpen(!isOpen);
    };

    const [currentMessage, setCurrentMessage] = useState("");
    const [chat, setChat] = useState([]);

    const sendMessage = async (e) => {
        if (e.key === "Enter") {
            const messageData = {
                room: documentId,
                userId: socket.id,
                username: username,
                message: currentMessage,
                time: new Date().getHours() + ":" + new Date().getMinutes(),
            };
            await socket.emit("send-message", messageData);
            setCurrentMessage("");
            setChat(current => [...current, messageData]);
        }
    };

    useEffect(() => {
        socket.on("receive-message", (data) => {
            setChat(current => [...current, data]);
        });
    }, [socket]);

    return (
        <>
            {isOpen ? (
                <div className="chat">
                    <div className="message-area">
                        <ul>
                            {chat.map((content, index) => {
                                return <li key={`message-${index}`}>{content.message}</li>
                            })}
                        </ul>
                    </div>
                    <input
                        type="text"
                        name=""
                        id=""
                        value={currentMessage}
                        ref={input}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyDown={(e) => sendMessage(e)}
                    />
                    <span ref={btn} onClick={() => handleBox()}>
                        X
                    </span>
                </div>
            ) : null}
        </>
    );
}
