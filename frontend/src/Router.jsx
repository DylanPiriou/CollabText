import React from 'react';
import Home from './Home/Home';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidv4} from "uuid";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Navigate replace to={`/documents/${uuidv4()}`}/>}/>
        <Route path="/documents/:id" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}
