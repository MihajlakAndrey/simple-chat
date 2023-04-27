const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const httpServer = require('http').createServer(app)

const URL = process.env.REACT_APP_API_URL || `http://localhost:3000`
const PORT = process.env.PORT || 3000

const io = require('socket.io')(httpServer, {
  cors: {
    origin: URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
})

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '/build')))

const rooms = new Map()

app.get('/rooms/:id', (req, res) => {
  const roomId = req.params.id
  const roomObj = {
    users: [...rooms.get(roomId).get('users').values()],
    messages: [...rooms.get(roomId).get('messages').values()],
  }
  res.json(roomObj)
})

app.post('/rooms', (req, res) => {
  const { roomId } = req.body
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ])
    )
  }

  res.json([...rooms.keys()])
})

io.on('connection', (socket) => {
  socket.on('room_join', ({ roomId, userName }) => {
    socket.join(roomId)
    rooms.get(roomId).get('users').set(socket.id, userName)
    const users = [...rooms.get(roomId).get('users').values()]
    socket.to(roomId).emit('room_updateUsers', users)
  })

  socket.on('room_newMessage', ({ messageText, roomId, userName }) => {
    const messageObj = {
      userName,
      messageText,
    }
    rooms.get(roomId).get('messages').push(messageObj)
    socket.to(roomId).emit('room_newMessage', messageObj)
  })

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').size === 0) {
        rooms.delete(roomId)
      }
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()]
        socket.to(roomId).emit('room_updateUsers', users)
      }
    })
  })
})

httpServer.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log('Server listening on PORT', PORT)
})
