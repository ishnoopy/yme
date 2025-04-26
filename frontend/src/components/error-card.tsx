
export default function ErrorCard({ error, message }: { error: string, message?: string }) {

  return (
    <div>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-48 h-48">
          {/* SVG illustration of a road construction worker */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-full h-full object-contain"
          >
            <circle cx="32" cy="32" r="30" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2" />
            <path
              d="M20 40 L44 40 L32 20 Z"
              fill="#f87171"
              stroke="#ef4444"
              strokeWidth="2"
            />
            <circle cx="32" cy="32" r="4" fill="#fbbf24" />
            <path
              d="M28 44 L36 44"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-500">
          {"Oops! Something Went Wrong"}
        </h1>
        <p className="text-center text-lg">
          {error}
          {message && (
            <p className="mt-2 text-sm text-gray-500">
              {message}
            </p>
          )}
        </p>
      </div>
    </div>
  )
}
