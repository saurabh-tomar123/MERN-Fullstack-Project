import React, { useEffect, useState, useRef } from "react";

import './index.css'
import {
  MainContainer, ChatContainer, MessageList, Message, MessageInput,
  TypingIndicator, Avatar, ConversationHeader, VideoCallButton, Conversation,
  VoiceCallButton, InfoButton, MessageSeparator, Sidebar, Search, ConversationList,
  Button,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import music from './Client_src_mixkit-tile-game-reveal-960.wav';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ChatMessage from "./ChatMessage";
import { Input } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, setContactList, setUsername, setCurrentUser } from "./counterSlice";


export default function ChatBox() {
  const [isTyping, setIsTyping] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentMessage, setcurrentMessage] = useState("");
  const [room, setRoom] = useState("1");
  const [showChat, setShowChat] = useState(false)
  const [typingUser, setTypingUser] = useState("");
  const notification = new Audio(music)

  const { username, messages, contactList, initialConversations, socket, currentUser } = useSelector((state) => state.counter);
  const dispatch = useDispatch();



  const handleSend = async (text) => {

    if (currentMessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: username,
        message: text,
        time:
          (new Date(Date.now()).getHours() % 12) +
          ":" +
          new Date(Date.now()).getMinutes(),
        read: true
      }



      await socket.emit("send_message", messageData);
        // setMessages((list) => [...list, messageData]);
      setcurrentMessage("");
      // notification.play();
    };
  }


  const joinChat = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", '1');
      setShowChat(true)
      notification.play();
    }
  };

  const handleTyping = (e) => {
    setcurrentMessage(e?.target?.value)
    socket.emit("typing", username);
  };


  useEffect(() => {
    const handleReceiveMsg = (data) => {
      dispatch(setCurrentUser(data))
      dispatch(setMessages(data))
    };
    socket.on("receive_message", handleReceiveMsg);

    socket.on("messageReadUpdate", (updatedMessage) => {
      let xsxsx = messages.map((m, index) => {
        if (m.id === updatedMessage.messageId) {
          let item = { ...m, read: true }
          return item
        } else {
          return m
        }

      })

      dispatch(setMessages(xsxsx))
    })

    return () => {
      socket.off("receive_message", handleReceiveMsg);
      socket.off("messageReadUpdate");
    };
  }, [socket]);

  useEffect(() => {
    const handleTypingEvent = (user) => {
      if (user !== username) { // only show if it's NOT me
        setTypingUser(user);
        setIsTyping(true);


        // hide after 1 second if no more typing
        setTimeout(() => setIsTyping(false), 1000);
      }
    };

    socket.on("typing", handleTypingEvent);

    return () => {
      socket.off("typing", handleTypingEvent);
    };
  }, [typingUser]);

  return (<div>
    <h1>{username} {(navigator.onLine) ? `is Online` : `is Offline`}</h1>

    {!showChat ? (
      <div className="join_room">
        <h1>Join Chat</h1>
        <Input
          type="text"
          placeholder="Enter Your Name"
          style={{height:""}}
          onChange={(e) => dispatch(setUsername(e.target.value))}
        />
        <Button style={{border:"1px solid gray"}} onClick={joinChat}>Join</Button>
      </div>
    ) :



      (<MainContainer style={{ maxWidth: "800px", width: "100%", borderRadius: "20px" }}>
        <Sidebar
          position="left"
          style={{ 'flexBasis': open ? "10%" : "35%", transition: "transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
            display: window.innerWidth > 800 ? 'block': 'none'
           }}
        >
          <KeyboardArrowRightIcon style={{
            padding: "5px", border: "1px solid gray", borderRadius: "50%",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
             transition: "all 0.3s ease",
             margin: "auto"
          }} onClick={() => setOpen(!open)} />
          <Search placeholder="Search..."
            onChange={(value) => {
              const filtered = initialConversations.filter(c =>
                c.name.toLowerCase().includes(value.toLowerCase())
              );
              dispatch(setContactList(filtered))
            }}
          />

          <ConversationList>
            {contactList
              .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
              .map((c, index) => (
                <Conversation key={index} name={c.name} info={c.info} onClick={() => {
                  dispatch(setUsername(c.name))
                  setRoom('1')

                }}>
                  <Avatar name={c.name} src={c.avatar} status={c.status} />
                </Conversation>
              ))}
          </ConversationList>
        </Sidebar>
        <ChatContainer
          style={{
            height: '500px'
          }}
        >
          <ConversationHeader>
            <Avatar
              name="Emily"
              src="https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg"
            />
            <ConversationHeader.Content
            style={{textAlign: "start"}}
              info="online"
              userName={typingUser ? typingUser : "Not Joined"}
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          {/* <MessageList> */}
          <MessageList typingIndicator={isTyping ? <TypingIndicator content={`${typingUser} is typing`} /> : null}
          >
            {messages.map((m, i) => (
              <ChatMessage data={m} messageId={m.id} />
            ))}
            {/* <MessageSeparator content="Saturday, 30 November 2019" /> */}


          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} onChange={handleTyping} attachButton={true} />
        </ChatContainer>
      </MainContainer>)}
  </div>
  );
}

