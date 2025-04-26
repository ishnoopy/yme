import Feed from "@/pages/Feed";
import Login from "@/pages/Login";
import Message from "@/pages/Message";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import { Route, Routes } from "react-router-dom";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";

export default function index() {


	return (
		<Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Feed />} />
			<Route path="/login" element={<Login />} />
			<Route path="/message/:userId" element={<Message />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/signup" element={<Register />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
