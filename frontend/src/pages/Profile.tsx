import { Share2, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { QRCodeCard } from "@/components/qr-code-card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/components/services/message";
import { toast } from "sonner";
import ErrorCard from "@/components/error-card";
import { CONFIG } from "@/config";

export default function ProfilePage() {
	const { user } = useAuth();
	const {
		data: messages,
		isError,
		error,
	} = useQuery({
		queryKey: ["messages"],
		queryFn: () => getMessages(user?.id),
	});

	//DOCU: If there is an error getting the messages, show an error card
	if (isError) {
		return (
			<div className="flex flex-col min-h-screen justify-center items-center">
				<ErrorCard error={error?.message || "Error fetching messages"} />
			</div>
		);
	}

	//DOCU: Filter the messages to only show the unanswered ones to get the count of unanswered messages
	const unansweredMessages = messages?.data?.filter(
		(message: any) => message.is_answered === false
	);

	//DOCU: Profile variables
	const username = user?.username;
	const userId = user?.id;
	const joinedAt = new Date(
		user?.created_at?.split("T")[0]
	).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const messageUserLink = `${CONFIG.DOMAIN}/message/${userId}`;
	const profileLink = `${CONFIG.DOMAIN}/${username}`;

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 py-8">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
						<div className="space-y-6">
							<div className="flex flex-col md:flex-row gap-6 items-start">
								<Avatar className="h-24 w-24 border-4 border-white shadow-md">
									<AvatarImage
										src="/placeholder.svg?height=96&width=96"
										alt={username}
									/>
									<AvatarFallback>{username?.charAt(0)?.toUpperCase()}</AvatarFallback>
								</Avatar>
								<div className="space-y-2">
									<div className="flex flex-wrap items-center gap-2">
										<h1 className="text-3xl font-bold tracking-tight">
											@{username}
										</h1>
										<Badge
											variant="outline"
											className="text-purple-600 border-purple-200 bg-purple-50"
										>
											Beta
										</Badge>
									</div>
									<p className="text-gray-500">
										Received {messages?.data?.length} messages • Joined {joinedAt}
									</p>
									<div className="flex flex-wrap gap-2 pt-2">
										<Button size="sm" className="gap-1" onClick={() => {
											navigator.clipboard.writeText(profileLink);
											toast.success("Link copied to clipboard", {
												duration: 1000,
												position: "top-right",
												richColors: true,
											});
										}}>
											<Share2 className="h-4 w-4" />
											Share Profile
										</Button>
									</div>
								</div>
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Your Message Link</CardTitle>
									<CardDescription>
										Share this link to receive anonymous messages
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex space-x-2">
										<Input value={messageUserLink} readOnly />
										<Button
											variant="outline"
											size="icon"
											className="cursor-pointer"
											onClick={() => {
												navigator.clipboard.writeText(messageUserLink);
												toast.success("Link copied to clipboard", {
													duration: 1000,
													position: "top-right",
													richColors: true,
												});
											}}
										>
											<Copy className="h-4 w-4" />
											<span className="sr-only">Copy</span>
										</Button>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Profile Stats</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="bg-gray-100 p-4 rounded-lg text-center">
											<p className="text-2xl font-bold text-purple-600">
												{messages?.data?.length}
											</p>
											<p className="text-sm text-gray-500">Total Messages</p>
										</div>
										<div className="bg-gray-100 p-4 rounded-lg text-center">
											<p className="text-2xl font-bold text-purple-600">
												{unansweredMessages?.length}
											</p>
											<p className="text-sm text-gray-500">Unanswered</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<div className="space-y-6">
							<QRCodeCard
								username={username}
								messageUserLink={messageUserLink}
							/>

							<Card>
								<CardHeader>
									<CardTitle>Engagement Tips</CardTitle>
									<CardDescription>
										Get more messages with these tips
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="bg-gray-100 p-4 rounded-lg">
										<p className="text-sm">
											Add your AnonyMsg link to your Instagram bio
										</p>
									</div>
									<div className="bg-gray-100 p-4 rounded-lg">
										<p className="text-sm">
											Share your QR code in your social media stories
										</p>
									</div>
									<div className="bg-gray-100 p-4 rounded-lg">
										<p className="text-sm">
											Ask a question in your profile to encourage responses
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
