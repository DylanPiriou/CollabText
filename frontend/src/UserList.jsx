import React from 'react'

export default function UserList({ onlineUsers }) {
  return (
    <ul>
            {onlineUsers.map(user => {
                return <li>{user.name}</li>
            })}
        </ul>
  )
}
