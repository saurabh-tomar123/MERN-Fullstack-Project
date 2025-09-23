import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const Conversations = [
  {
    name: "Lilly",
    info: "Yes I can do it for you",
    lastSenderName: "Lilly",
    avatar: "https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg",
    status: "available",
  },
  {
    name: "Joe",
    info: "Yes I can do it for you",
    lastSenderName: "Joe",
    avatar: "https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg",
    status: "dnd",
  },
  {
    name: "Emily",
    info: "Yes I can do it for you",
    lastSenderName: "Emily",
    avatar: "https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg",
    status: "available",
    unreadCnt: 3,
  },
  {
    name: "Kai",
    info: "Yes I can do it for you",
    lastSenderName: "Kai",
    avatar: "https://chatscope.io/storybook/react/assets/kai-5wHRJGb2.svg",
    status: "unavailable",
    unreadDot: true,
  },
  {
    name: "Akane",
    info: "Yes I can do it for you",
    lastSenderName: "Akane",
    avatar: "https://chatscope.io/storybook/react/assets/akane-MXhWvx63.svg",
    status: "eager",
  },
  {
    name: "Eliot",
    info: "Yes I can do it for you",
    lastSenderName: "Eliot",
    avatar: "https://chatscope.io/storybook/react/assets/eliot-JNkqSAth.svg",
    status: "away",
  },
  {
    name: "Zoe",
    info: "Yes I can do it for you",
    lastSenderName: "Zoe",
    avatar: "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg",
    status: "dnd",
  },
  {
    name: "Patrik",
    info: "Yes I can do it for you",
    lastSenderName: "Patrik",
    avatar: "https://chatscope.io/storybook/react/assets/patrik-yC7svbAR.svg",
    status: "invisible",
  },
]

const initialState = {
  initialConversations : [...Conversations],
  messages: [],
  contactList: [...Conversations],
  socket : io("http://192.168.122.106:5000"),
  username: "saurabh",
  currentUser:{}
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setMessages: (state, action) => {
    console.log(action.payload)
    state.messages = [...state.messages, {...action.payload}]
    },
    setContactList: (state, action) => {
      state.contactList = [...action.payload ]
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setCurrentUser: (state,action) => {
            state.currentUser = {...action.payload}
    }
  }
});

// Export actions
export const { setMessages, setContactList, setUsername, setCurrentUser } = counterSlice.actions;

// Export reducer
export default counterSlice.reducer;
