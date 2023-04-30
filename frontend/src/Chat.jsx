import React, { useEffect, useRef, useState } from "react";
import "./Chat.scss";
import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat({ username, socket, documentId }) {
    const [isOpen, setIsOpen] = useState(true);
    const input = useRef();

    const [currentMessage, setCurrentMessage] = useState("");
    const [chat, setChat] = useState([]);

    const sendMessage = async (e) => {
        if (currentMessage !== "" && currentMessage.trim().length !== 0) {
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

    const handleChat = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            {isOpen ? (
                <div className="chat-icon" onClick={() => handleChat()}>
                    ☎
                </div>
            ) : (
                <>
                    <div className="chat-icon" onClick={() => handleChat()}>
                        x
                    </div>
                <div className="chat">
                    <ScrollToBottom className="chat-content">
                        <ul className="message-area">
                            {chat.map((content, index) => {
                                return (
                                    <li className="message" id={username === content.username ? "me" : "other"} key={`message-${index}`}>
                                        <div className="content-wrapper">
                                            <div className="content">{content.message}</div>
                                            <div className="data">{content.username} - {content.time}</div>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                name=""
                                id=""
                                placeholder="Let's talk !"
                                value={currentMessage}
                                ref={input}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyDown={(e) => {e.key === "Enter" && sendMessage(e)}}
                            />
                            <button onClick={() => sendMessage()}>►</button>
                        </div>
                    </ScrollToBottom>
                </div>
                </>
            )}
        </>
    );
}
