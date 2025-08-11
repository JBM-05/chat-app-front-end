import UserMessageStore from "../store/UserMessageStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./Skeletons/MessageSkeleton";
import UserAuthStore from "../store/UserAuthStore";
import { formatMessageTime } from "../lib/util";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isGettingMessages,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = UserMessageStore();
  const { userAuth } = UserAuthStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const userId = selectedUser?._id;

  useEffect(() => {
    if (!userId) return;
    getMessages(userId);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [userId, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
        setTimeout(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100)
    }
  }, [messages]);

  if (isGettingMessages) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id ?? `message-${index}`}
            className={`chat ${
              message.senderId === userAuth!._id ? "chat-end" : "chat-start"
            }`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === userAuth!._id
                      ? userAuth?.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
