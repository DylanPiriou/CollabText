import React from 'react';
import TextEditor from './TextEditor';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidv4} from "uuid";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Navigate replace to={`/documents/${uuidv4()}`}/>}/>
        <Route path="/documents/:id" element={<TextEditor/>}/>
      </Routes>
    </BrowserRouter>
  )
}
