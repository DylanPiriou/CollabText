import React, { useEffect, useRef, useState } from "react";
import "./Chat.scss";
import ScrollToBottom from "react-scroll-to-bottom";
import { RxCross1 } from "react-icons/rx";
import { RxChatBubble } from "react-icons/rx";
import { RxPaperPlane } from "react-icons/rx";

export default function Chat({ username, socket, documentId }) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isWriting, setIsWriting] = useState("");
  const [chat, setChat] = useState([]);

  socket.on("display-messages", messages => {
    setChat(messages);
  })

  // Récupère ce qui est écrit dans l'input + affiche que quelqu'un écrit
  const handleChange = (e) => {
    setCurrentMessage(e.target.value);
    handleWritting();
  };

  // Envoie de l'event que username écrit
  const handleWritting = () => {
    socket.emit("writting", username);
  };

  // Envoie d'event que username n'écrit plus
  const handleNotWritting = () => {
    socket.emit("not-writting");
  };

  // Récéption des évènements lorque quelqu'un écrit/n'écrit plus
  useEffect(() => {
    socket.emit("load-messages", documentId);

    socket.on("writting", (username) => {
      setIsWriting(`${username} est en train d'écrire...`);
    });
    socket.on("not-writting", () => {
      setIsWriting("");
    });

    return () => {
      socket.off("writting");
      socket.off("not-writting");
    };
  }, []);

  // Logique pour envoyer un message
  const sendMessage = async (e) => {
    if (currentMessage.trim().length !== 0) {
      const messageData = {
        room: documentId,
        userId: socket.id,
        username: username,
        message: currentMessage,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
      };
      await socket.emit("send-message", messageData);
      setCurrentMessage("");
      setChat((current) => [...current, messageData]);
      handleNotWritting();
    }
  };

  // Logique pour recevoir le message
  const [newMessage, setNewMessage] = useState(false);
  useEffect(() => {

    socket.on("receive-message", (data) => {
      setChat((current) => [...current, data]);
      setNewMessage(true);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  // Logique pour l'ouverture/fermeture du chat
  const handleChat = () => {
    setIsOpen(!isOpen);
    setNewMessage(false);
  };

  return (
    <>
      {isOpen ? (
        <div className="chat-icon" onClick={() => handleChat()}>
          <RxChatBubble /> {newMessage && <span className="notif"></span>}
        </div>
      ) : (
        <>
          <div className="chat-icon" onClick={() => handleChat()}>
            <RxCross1/>
          </div>
          <div className="chat">
            <ScrollToBottom className="chat-content">
              <ul className="message-area">
                {chat.map((content, index) => {
                  return (
                    <li
                      className="message"
                      id={username === content.username ? "me" : "other"}
                      key={`message-${index}`}
                    >
                      <div className="content-wrapper">
                        <div className="content">{content.message}</div>
                        <div className="data">
                          {content.username} - {content.time}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="writing">{isWriting}</p>
              <div className="input-wrapper">
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Commencez à parler..."
                  value={currentMessage}
                  onChange={(e) => handleChange(e)}
                  onBlur={() => {
                    handleNotWritting();
                  }}
                  onKeyDown={(e) => {
                    e.key === "Enter" && sendMessage(e);
                  }}
                />
                <button onClick={() => sendMessage()}><RxPaperPlane/></button>
              </div>
            </ScrollToBottom>
          </div>
        </>
      )}
    </>
  );
}
