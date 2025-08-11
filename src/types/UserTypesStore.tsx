export type UserAuthStoreType = {
  userAuth: string | null;
    onlineUsers: string[];
  checkingAuth: () => void;
  isCheckingAuth: boolean;
};
export type UserThemeStoreType = {
  theme: string ;
  setTheme: (t :string ) => void;
};
export type UserMessageStoreType={
  messages: User[]| [] ;
  users: User[];
  selectedUser: User | null;
  isGettingUsers: boolean;
  isGettingMessages: boolean;
  getUsers: () => Promise<void>;
  getMessages: (receiverId: string) => Promise<void>;
  setSelectedUser: (user:User | null ) => void;
  sendMessage: (messageData: { text: string; image: string | null }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}
 export type User={
  _id: string;
  name: string;
  profilePic?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  senderId?: string;
  receiverId?: string;
  image?: string;
  text?: string;
}