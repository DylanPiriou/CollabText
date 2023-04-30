import React, { useCallback, useEffect, useRef, useState } from 'react';
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import  { useParams }  from 'react-router-dom';
import Modal from './Modal';
import Header from './Header';

// Options pour la barre d'outil de l'éditeur de texte (Quill)
const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() {
    // States
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    
    // Récupération de l'id dans l'URL que l'on renomme documentId
    const { id: documentId } = useParams();
    
    // Connexion au serveur sur le port 3001
    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);
        
        return () => {
            s.disconnect();
        }
    }, [])

    // Chargement du contenu de l'éditeur à partir du serveur
    useEffect(() => {
        if(socket == null || quill == null) return;
        socket.once("load-document", document => {
            quill.setContents(document);
            quill.enable();
        })
        socket.emit("get-document", documentId);
    }, [socket, quill, documentId])

    useEffect(() => {
        if(socket == null || quill == null) return;
        const interval = setInterval(() => {
            socket.emit("save-document", quill.getContents())
        }, 2000);

        return () => {
            clearInterval(interval)
        }
    }, [socket, quill])

    // Ecoute les modifications venant d'autres utilisateurs
    useEffect(() => {
        if(socket == null || quill == null) return;
        const handler = (delta) => {
            quill.updateContents(delta);
        }
        socket.on("receive-changes", handler)

        return () => {
            socket.off("receive-changes", handler)
        }
    }, [socket, quill])

    // Ecoute les modifications dans l'éditeur Quill + envoie au serveur
    useEffect(() => {
        if(socket == null || quill == null) return;
        const handler = (delta, oldDelta, source) => {
            if(source !== "user") return;
            socket.emit("send-changes", delta)
        }
        quill.on("text-change", handler)

        return () => {
            quill.off("text-change", handler)
        }
    }, [socket, quill])

    // Création d'une nouvelle instance de l'éditeur Quill qu'on ajoute au DOM
    const wrapperRef = useCallback((wrapper) => {
        if(wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, { theme: "snow", modules: {
            toolbar: toolbarOptions
        } })
        q.disable();
        q.setText("Chargement...");
        setQuill(q);
    }, [])

    // Gestion du pseudo et stockage dans le localStorage
    const [isNamed, setIsNamed] = useState(false);
    const [username, setUsername] = useState("");
    
    const handleKeyPress = e => {
        if(e.key === "Enter"){
            setIsNamed(true);
            socket.emit("add-user", { username, documentId });

        }
    }

  return (
    <>
    {isNamed === false ? (
        <Modal socket={socket} username={username} setUsername={setUsername} handleKeyPress={handleKeyPress} />
    ) : (
        <>
        <Header socket={socket} username={username} documentId={documentId} />
        <div className="container" ref={wrapperRef}></div>
        </>
    )}
    </>
  )
}
