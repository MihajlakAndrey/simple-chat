import axios from 'axios'
import { useEffect, useState } from 'react'

import Form from './Form'
import Room from './Room'
import socket from './socket'
import styles from './App.module.scss'
import { URL } from '.'

function App() {
  const [isJoined, setIsJoined] = useState(false)
  const [userData, setUserData] = useState({ roomId: null, userName: null })

  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])

  const onJoin = async ({ roomId, userName }) => {
    setUserData({ roomId, userName })
    setIsJoined(true)
    socket.emit('room_join', { roomId, userName })
    const { data: roomData } = await axios.get(`${URL}/rooms/${roomId}`)
    setUsers(roomData.users)
    setMessages(roomData.messages)
  }

  useEffect(() => {
    socket.on('room_updateUsers', (users) => setUsers(users))
    socket.on('room_newMessage', (messageObj) =>
      setMessages((prev) => [...prev, messageObj])
    )
  }, [])

  return (
    <div className={styles.App}>
      {isJoined ? (
        <Room
          setMessages={setMessages}
          messages={messages}
          userData={userData}
          users={users}
        />
      ) : (
        <Form onJoin={onJoin} />
      )}
    </div>
  )
}

export default App
