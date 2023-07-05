function JoinChatRoom() {
    return ( 
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-500">Join a Chat Room</h1>
            <div>
                <input type="text" className="bg-slate-500 border border-slate-800 p-2" placeholder="Enter a chat room code" />
            </div>
            <div className="my-2">
                <button className='bg-yellow-500 rounded px-2'>Join</button>
            </div>
        </div>
    );
}

export default JoinChatRoom;