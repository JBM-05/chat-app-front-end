import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";
interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
}
interface data {
  name?: string;
  email: string;
  password: string;
  profilePic?: string;
}
export interface UserAuthState {
  userAuth: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  checkingAuth: () => Promise<void>;
  signUp: (data: data) => Promise<void>;
  logOut: () => Promise<void>;
  logIn: (data: data) => Promise<void>;
  updateProfile: (formData:FormData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}
const BASE_URL =
  import.meta.env.VITE_BASE_URL ;

const UserAuthStore = create<UserAuthState>((set, get) => ({
  userAuth: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  checkingAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      const { user } = res.data;
      set({ userAuth: { ...user } });
      get().connectSocket();
    } catch (error) {
      set({ userAuth: null });
      console.error("Error checking authentication:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      const { user } = res.data;
      set({ userAuth: { ...user } });
      get().connectSocket();
      toast.success("Signup successful!");
      <Navigate to="/" replace={true} />;
    } catch (error) {
      console.error("Signup error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(
          `Signup failed: ${err.response?.data?.message || "Unknown error"}`
        );
      } else {
        toast.error("Signup failed: Unknown error");
      }
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },
  logOut: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ userAuth: null });
      get().disconnectSocket();
      toast.success("Logout successful!");
      <Navigate to="/login" replace={true} />;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed: Unknown error");
    }
  },
  logIn: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const { user } = res.data;
      set({ userAuth: { ...user } });
      toast.success("Login successful!");
      <Navigate to="/" replace={true} />;
      get().connectSocket();
    } catch (error) {
      console.error("Login error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(
          `Login failed: ${err.response?.data?.message || "Unknown error"}`
        );
      } else {
        toast.error("Login failed: Unknown error");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
 updateProfile: async (formData: FormData) => {
  set({ isUpdatingProfile: true });
  try {
    const res = await axiosInstance.put("/auth/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { user } = res.data;
    set({ userAuth: { ...user } });
    toast.success("Profile updated successfully!");
  } catch (error) {
    console.error("Update profile error:", error);
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        `Update failed: ${err.response?.data?.message || "Unknown error"}`
      );
    } else {
      toast.error("Update failed: Unknown error");
    }
  } finally {
    set({ isUpdatingProfile: false });
  }
},

  connectSocket: () => {
    const { userAuth } = get();
    if (!userAuth || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: userAuth._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
export default UserAuthStore;
