import { Link } from "react-router-dom"
import { AlertCircle } from "lucide-react";

export default function NotFound() {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-md space-y-6">
            <div className="flex flex-col items-center justify-center gap-2 border-2 border-gray-200 rounded-md p-4 bg-gradient-to-br from-purple-500 to-pink-500">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold text-white">404 Not Found</h1>
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-100">The page you are looking for does not exist.</p>
            </div>
            <Link to="/" className="text-purple-600 hover:text-purple-700 hover:underline underline-offset-4  ho">Go back to the home page</Link>
          </div>
        </div>
      </main>
    </div>
	);
}
