import { useAuth } from "@/context/AuthContext";
import { useRoute } from "@/context/RouteContext";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { CONFIG } from "@/config";

function LoggedInNavbar({
	isActive,
	handleLogout,
}: {
	isActive: (page: string) => boolean;
	handleLogout: () => void;
}) {
	return (
		<nav className="ml-auto flex gap-4 sm:gap-6">
			<Link
				className={`text-sm font-medium hover:underline underline-offset-4 ${
					isActive("profile") ? "text-purple-600" : "text-gray-500"
				}`}
				to="/profile"
			>
				Profile
			</Link>
			{/* <Link
				className={`text-sm font-medium hover:underline underline-offset-4 ${
					isActive("dashboard") ? "text-purple-600" : "text-gray-500"
				}`}
				to="/dashboard"
			>
				Dashboard
			</Link> */}
			<Link
				className={`text-sm font-medium hover:underline underline-offset-4 ${
					isActive("feed") ? "text-purple-600" : "text-gray-500"
				}`}
				to="/feed"
			>
				Feed
			</Link>
			<span
				className={`text-sm font-medium cursor-pointer hover:underline underline-offset-4 ${
					isActive("logout") ? "text-purple-600" : "text-gray-500"
				}`}
				onClick={handleLogout}
			>
				Logout
			</span>
		</nav>
	);
}

function LoggedOutNavbar({
	isActive,
}: {
	isActive: (page: string) => boolean;
}) {
	return (
		<nav className="ml-auto flex gap-4 sm:gap-6">
			{/* <Link
				className={`text-sm font-medium hover:underline underline-offset-4 ${
					isActive("features") ? "text-purple-600" : "text-gray-500"
				}`}
				to="/features"
			>
				Features
			</Link> */}
			{/* <Link
				className={`text-sm font-medium hover:underline underline-offset-4 ${
					isActive("about") ? "text-purple-600" : "text-gray-500"
				}`}
				to="/about"
			>
				About
			</Link> */}
			<Link
				className={`text-sm font-medium hover:underline underline-offset-4 ${
					isActive("login") ? "text-purple-600" : "text-gray-500"
				}`}
				to="/login"
			>
				Login
			</Link>
		</nav>
	);
}

export default function Navbar() {
	const { user, setLogout } = useAuth();
	const isLoggedIn = !!user;
	const { currentPage } = useRoute();
	const isActive = (page: string) => currentPage === page;

	const handleLogout = () => {
		setLogout();
	};

	return (
		<header className="px-4 lg:px-6 h-14 flex items-center sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
			<Link className="flex items-center justify-center" to="/">
				<MessageSquare className="h-6 w-6 text-purple-600" />
				<span className="ml-2 text-xl font-bold">{CONFIG.APP_NAME}</span>
			</Link>
			{isLoggedIn ? (
				LoggedInNavbar({
					isActive,
					handleLogout,
				})
			) : (
				<LoggedOutNavbar isActive={isActive} />
			)}
		</header>
	);
}
