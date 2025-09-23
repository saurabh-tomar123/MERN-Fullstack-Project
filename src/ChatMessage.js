import { Message } from "@chatscope/chat-ui-kit-react";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useSelector } from "react-redux";

export default function ChatMessage({ data }) {
  const { socket, username } = useSelector((state) => state.counter);
  const { message, time, read } = data

  const handleReadMessage = (messageId, room) => {
    socket.emit("messageRead", { messageId, room });
  };


  return (
    <div>
      <Message
        model={{
          direction: username === data.author ? "outgoing" : "incoming",
          position: "single",
          sender: "Oliver",
          message: message // keep this as a string for fallback
        }}

      >
        <Message.CustomContent
        //   onClick={() => {
        //   if (data.author !== username) {
        //     handleReadMessage(data.id, data.room);
        //   }
        // }}
        >
          {message}
          {username === data.author && <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "0.25rem",        // gap-1 = 4px
              fontSize: "0.75rem",   // text-xs = 12px
              color: "#6B7280",      // text-gray-500
              marginTop: "0.25rem"   // mt-1 = 4px
            }}
          >
            <span>{time}</span>
            {read ? (
              <DoneAllIcon style={{ fontSize: 14, color: "#3B82F6" }} /> // blue-500
            ) : (
              <DoneIcon style={{ fontSize: 14, color: "#6B7280" }} />    // gray-500
            )}
          </div>
          }
        </Message.CustomContent>
      </Message>
    </div>

  );
}
