import axios from 'axios'
import React, { useState } from 'react'
import { URL } from '.'

import styles from './App.module.scss'

const Form = ({ onJoin }) => {
  console.log(process.env.REACT_APP_API_URL)
  const [roomId, setRoomId] = useState(``)
  const [userName, setName] = useState(``)

  const onButtonClick = async () => {
    if (!roomId || !userName) {
      return alert(`Fields can't be empty`)
    }
    if (roomId.length > 10 || userName.length > 10) {
      return alert(`The maximum length of the fields is 10 characters`)
    }
    try {
      await axios.post(`${URL}/rooms`, { roomId })
      onJoin({ roomId, userName })
    } catch (error) {
      console.log(error)
      alert(`An error occurred`)
    }
  }

  return (
    <div className={styles.Form_block}>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Name"
        value={userName}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={onButtonClick}>Join</button>
    </div>
  )
}

export default Form
