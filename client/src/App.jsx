import { useSelector } from "react-redux";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Chat2 from "./pages/Chat2";
import UserProfile from "./pages/UserProfile";

function App() {
  const user = useSelector((state) => state.authReducer.authData);

  return (
    <div className="relative overflow-hidden text-[#242d49] bg-[#f3f3f3] p-4 min-h-screen">
      {/* Blur effects */}
      <div className="absolute w-[22rem] h-[14rem] rounded-full bg-[#a6ddf0] filter blur-[72px] top-[-18%] right-0 z-0"></div>
      <div className="absolute w-[22rem] h-[14rem] rounded-full bg-[#a6ddf0] filter blur-[72px] top-[36%] -left-32 z-0"></div>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="home" /> : <Navigate to="auth" />}
        />
        <Route
          path="/home"
          element={user ? <Home /> : <Navigate to="../auth" />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="../home" /> : <Auth />}
        />
        <Route
          path="/profile/:id"
          element={user ? <Profile /> : <Navigate to="../auth" />}
        />
        <Route
          path="/UserProfile/:id"
          element={user ? <UserProfile /> : <Navigate to="../auth" />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="../auth" />}
        />
        <Route
          path="/chat/:id"
          element={user ? <Chat /> : <Navigate to="../auth" />}
        />
      </Routes>
    </div>
  );
}

export default App;
