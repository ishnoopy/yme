import { Link } from 'react-router-dom'
import { CONFIG } from '@/config'

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
    <p className="text-xs text-gray-500">© 2025 {CONFIG.APP_NAME}. All rights reserved.</p>
    <nav className="sm:ml-auto flex gap-4 sm:gap-6">
      <Link className="text-xs hover:underline underline-offset-4" to="#">
        Terms of Service
      </Link>
      <Link className="text-xs hover:underline underline-offset-4" to="#">
        Privacy
				</Link>
			</nav>
		</footer>
	);
}
