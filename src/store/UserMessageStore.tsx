import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-hot-toast";
import type { UserMessageStoreType } from "../types/UserTypesStore";
import UserAuthStore from "./UserAuthStore";
const UserMessageStore = create<UserMessageStoreType>((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isGettingUsers: false,
  isGettingMessages: false,
  getUsers: async () => {
    set({ isGettingUsers: true });
    try {
      const res = await axiosInstance.get("/message/users");
      const { users } = res.data;
      set({ users: [...users] });
    } catch (error) {
      console.error("Error getting users:", error);
      toast.error("Failed to load users.");
    } finally {
      set({ isGettingUsers: false });
    }
  },
  getMessages: async (receiverId: string) => {
    set({ isGettingMessages: true });
    try {
      const res = await axiosInstance.get(`/message/${receiverId}`);
      const { messages } = res.data;
      set({ messages: [...messages ] });
      console.log("Messages fetched successfully:", messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      toast.error("Failed to load messages.");
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(`Error getting messages: ${err.response?.data?.message || "Unknown error"}`);
      } else {
        toast.error("Error getting messages: Unknown error");
      }
    } finally {
      set({ isGettingMessages: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/message/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.newMessage] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  },
  setSelectedUser: (user
  ) => {
    set({ selectedUser: user });
  },
   subscribeToMessages: () => {
    
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = UserAuthStore.getState().socket;

    socket!.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
      console.log("New message received:", newMessage);
    });
  },
   unsubscribeFromMessages: () => {
    const socket = UserAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
}));
export default UserMessageStore;

