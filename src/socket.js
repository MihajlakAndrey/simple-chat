import io from 'socket.io-client'
import { URL } from '.'

const socket = io(URL)

export default socket
