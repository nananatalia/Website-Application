import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 5002 })

wss.on('connection', (ws) => {
    console.log('Nowe połączenie WS z urządzenia')
    ws.on('close', () => {
        console.log('Urządzenie rozłączone')
    })
})

export default wss