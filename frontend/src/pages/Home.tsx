import { Link, Navigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn) {
    return <Navigate to="/profile" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Get Anonymous Messages from Your Friends
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Create your profile, share your link, and receive honest messages from friends. No sign-up required
                    to send messages.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/signup">
                    <Button className=" cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Create Your Profile
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="absolute -top-6 -left-6 h-full w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-20"></div>
                  <div className="relative bg-white p-6 rounded-xl shadow-xl border">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                          A
                        </div>
                        <div>
                          <h3 className="font-semibold">@alexsmith</h3>
                          <p className="text-sm text-gray-500">12 messages received</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <p className="text-sm">You're always so positive and make everyone smile!</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <p className="text-sm">I've had a crush on you since freshman year 👀</p>
                        </div>
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <p className="text-sm">Your presentation yesterday was amazing!</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Send me a message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get anonymous messages from your friends in three simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Create Your Profile</h3>
                <p className="text-gray-500">Sign up in seconds and get your unique link</p>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Share Your Link</h3>
                <p className="text-gray-500">Share your profile link on social media or with friends</p>
              </div>
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Receive Messages</h3>
                <p className="text-gray-500">Get anonymous messages and feedback from your friends</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
