import React, { useRef, useState } from 'react'

export default function Chat() {
    const [isOpen, setIsOpen] = useState(true);
    const btn = useRef();
    const input = useRef();
    const handleBox = () => {
        setIsOpen(!isOpen)
    }

    const [inputValue, setInputValue] = useState("");
    const handleChange = e => {
        setInputValue(e.target.value);
    }

    const [content, setContent] = useState("");
    const handleKeyPres = e => {
        if(e.key === "Enter"){
            setInputValue("");
            setContent(inputValue);
        }
    }

  return (
    <>
    {isOpen ? (
    <div className="chat">
        <div className="message-area">
            <ul>
            <li>{content}</li>
            </ul>
        </div>
        <input type="text" name="" id="" value={inputValue} ref={input} onChange={(e) => handleChange(e)} onKeyDown={(e) => handleKeyPres(e)} />
        <span ref={btn} onClick={() => handleBox()}>X</span>
    </div>
    ) : (
        null
    )}
    </>
  )
}
