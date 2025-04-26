import { BrowserRouter } from "react-router-dom";
import "./App.css";
import GeneralLayout from "./layouts/General";
import { RouteProvider } from "./context/RouteContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import Routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";

export default function App() {
	
	return (
		<>
			<BrowserRouter>
				<QueryClientProvider client={new QueryClient()}>
					<AuthProvider>
					<WebSocketProvider>
						<RouteProvider>
							<Toaster />
							<GeneralLayout>
								<Routes />
							</GeneralLayout>
							</RouteProvider>
						</WebSocketProvider>
						<ReactQueryDevtools />
					</AuthProvider>
				</QueryClientProvider>
			</BrowserRouter>
		</>
	);
}
