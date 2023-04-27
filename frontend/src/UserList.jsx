import React, { useState, useEffect } from 'react'

export default function UserList({ socket }) {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
      socket.on("user-connected", user => {
          console.log("Un utilisateur s'est connecté", user)
          setOnlineUsers((prevUsers) => [...prevUsers, user])
          console.log(onlineUsers)
        });

        return () => {
          socket.off("user-connected");
        };
      }, [])

  return (
    <ul>
      {onlineUsers.map(user => {
        return <li key={user.name}>{user.name} s'est connecté !</li>
      })}
    </ul>
  )
}
