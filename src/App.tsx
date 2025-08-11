import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import UserAuthStore from "./store/UserAuthStore";
import { Loader } from "lucide-react";
import { Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserThemeStore from "./store/UserThemeStore";
import type { UserAuthStoreType, UserThemeStoreType } from "./types/UserTypesStore";

const App = () => {
  const { userAuth, checkingAuth, isCheckingAuth ,onlineUsers} =
    UserAuthStore() as UserAuthStoreType;
  const { theme } = UserThemeStore() as UserThemeStoreType;
  console.log("Online Users:", onlineUsers);
  useEffect(() => {
    checkingAuth();
    
  }, [checkingAuth]);
  console.log("User Auth:", userAuth);
  if (isCheckingAuth && userAuth === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin size-10 text-blue-500" size={48} />
      </div>
    );
  } else
    return (
      <div data-theme={theme}>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={userAuth ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!userAuth ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!userAuth ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={userAuth ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
        <Toaster />
      </div>
    );
};

export default App;
