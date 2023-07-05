interface ChatMessagesProps {
    messages: string[];
}

const ChatMessages = ({messages}: ChatMessagesProps) => {
    return(
        <ul>
            {messages.map((message, index) => (
                <li key={index}>{message}</li>
            ))}
        </ul>
    )
}

export default ChatMessages;