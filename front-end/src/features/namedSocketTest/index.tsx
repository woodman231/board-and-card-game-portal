import React from 'react'
import { namedSocket } from '../../socket'

function NamedSocketTest() {
    React.useEffect(() => {
        namedSocket.connect();
        namedSocket.emit('createNewRoom')

        namedSocket.on('roomCreatedReply', (data) => {
            console.log("roomCreatedReply", data);
        });
    }, [])

    return (
        <div>index</div>
    )
}

export default NamedSocketTest