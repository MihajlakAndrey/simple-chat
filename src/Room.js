import React, { useEffect, useRef, useState } from 'react'
import socket from './socket'
import styles from './App.module.scss'


const Room = ({ messages, userData, users, setMessages }) => {
  const [messageText, setMessageText] = useState(``)
  const messageRef = useRef()

  const onSend = () => {
    if (messageText.length === 0) return
    socket.emit('room_newMessage', { ...userData, messageText })
    setMessages((prev) => [...prev, { ...userData, messageText, isMine: true }])
    setMessageText(``)
  }

  const onQuit = () => {
    window.location.reload()
  }

  useEffect(() => {
    messageRef.current.scrollTo(0, 99999999)
  }, [messages])

  return (
    <div className={styles.Room_block}>
      <div className={styles.Info_block}>
        <div className={styles.Info}>
          <h3>Room ID: {userData.roomId}</h3>
          <h3>Connected users: ({users.length})</h3>
        </div>

        <div className={styles.User_list}>
          <ul>
            {users.map((name, index) => (
              <li key={name + index}>{name}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.Chat}>
        <div className={styles.Message_list} ref={messageRef}>
          {messages.map((m, index) => (
           m.isMine 
           ?  <div className={styles.MyMessage} key={index}>
                <span className={styles.text}>{m.messageText}</span>
                <span className={styles.userName}>{m.userName}</span>
             </div> 
         :  <div className={styles.Message} key={index}>
              <span className={styles.userName}>{m.userName}</span>
              <span className={styles.text}>{m.messageText}</span>
            </div>
          ))}
        </div>

        <div className={styles.MessageForm}>
          <input
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          ></input>
          <button className={styles.Send_button} onClick={onSend}>
            Send
          </button>
          <button className={styles.Quit_button} onClick={onQuit}>
            Quit
          </button>
        </div>
      </div>
    </div>
  )
}

export default Room
