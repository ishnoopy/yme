import { MessageSquare, Bell, ArrowRight, Reply } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ScrollMessages from "@/components/scroll-messages";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getMessages } from "@/components/services/message";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import AnsweredMessages from "@/components/answered-messages";

export interface Message {
	id: string;
	type: "text" | "voice" | "image";
	content?: string;
	created_at: string;
	is_answered: boolean;
	is_viewed: boolean;
	answer?: Record<string, any>;
}

export default function FeedPage() {
	const queryParams = useSearchParams();
	const navigate = useNavigate();

	const { user } = useAuth();
	const [messages, setMessages] = useState<Message[]>([]);
	const [unansweredMessages, setUnansweredMessages] = useState<Message[]>([]);

	const [answeredMessages, setAnsweredMessages] = useState<Message[]>([]);
	const [activeTab, setActiveTab] = useState<string>(
		queryParams[0].get("tab") || "inbox"
	);

	const [responseRate, setResponseRate] = useState<number>(0);


	useEffect(() => {
		setActiveTab(queryParams[0].get("tab") || "inbox");
	}, [queryParams]);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		navigate(`/feed?tab=${tab}`);
	};

	const {
		data: messagesDetails,
	} = useQuery({
		queryKey: ["messages"],
		queryFn: () => getMessages(user?.id),
	});

	useEffect(() => {
		if (messagesDetails?.data) {
			const messages = messagesDetails?.data?.map((message: Message) => ({
				...message,
				created_at: new Date(message.created_at).toLocaleString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
        })
        
      }));
      
			setMessages(messages);
			setUnansweredMessages(
				messages?.filter((message: Message) => message?.is_answered === false)
			);
			setAnsweredMessages(
				messages?.filter((message: Message) => message?.is_answered === true)
      );
      
      const responseRate = (messages?.filter((message: Message) => message?.is_answered === true)?.length /
        messages?.length) *
        100;

	  setResponseRate(responseRate > 0 ? parseFloat(Number(responseRate).toFixed(2)) : 0);
		}
	}, [messagesDetails]);

	const recentActivity: any[] = [
		// {
		//   id: 1,
		//   type: "new_message",
		//   date: "2 hours ago",
		//   count: 3,
		// },
		// {
		//   id: 2,
		//   type: "profile_view",
		//   date: "4 hours ago",
		//   count: 12,
		// },
		// {
		//   id: 3,
		//   type: "answered",
		//   date: "Yesterday",
		//   count: 5,
		// },
		// {
		//   id: 4,
		//   type: "new_follower",
		//   date: "2 days ago",
		//   username: "jamie92",
		// },
	];

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 py-8">
				<div className="container px-4 md:px-6 mx-auto">
					<div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:gap-12">
						<div className="space-y-6">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<h1 className="text-3xl font-bold tracking-tight">
										Your Message Feed
									</h1>
									<p className="text-gray-500">
										Stay updated with your latest messages and activity
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="outline"
										className="text-purple-600 border-purple-200 bg-purple-50"
									>
										<Bell className="h-3 w-3 mr-1" />
										{unansweredMessages?.length} Unanswered
									</Badge>
								</div>
							</div>

							<Tabs
								defaultValue={activeTab}
								value={activeTab}
								className="w-full"
							>
								<TabsList className="grid grid-cols-2 mb-4">
									<TabsTrigger
										value="inbox"
										className="cursor-pointer"
										onClick={() => handleTabChange("inbox")}
									>
										Inbox
									</TabsTrigger>
									<TabsTrigger
										value="answered"
										className="cursor-pointer"
										onClick={() => handleTabChange("answered")}
									>
										Answered
									</TabsTrigger>
								</TabsList>

								<TabsContent value="inbox" className="space-y-4">
									<ScrollMessages messages={unansweredMessages} />
								</TabsContent>

								<TabsContent value="answered" className="space-y-4">
									<AnsweredMessages answeredMessages={answeredMessages} />
								</TabsContent>
							</Tabs>
						</div>

						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Activity Feed</CardTitle>
									<CardDescription>
										Recent activity on your profile
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{recentActivity.map((activity) => (
										<div
											key={activity.id}
											className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
										>
											<div className="rounded-full bg-purple-100 p-2 mt-0.5">
												{activity.type === "new_message" && (
													<MessageSquare className="h-4 w-4 text-purple-600" />
												)}
												{activity.type === "profile_view" && (
													<Bell className="h-4 w-4 text-purple-600" />
												)}
												{activity.type === "answered" && (
													<Reply className="h-4 w-4 text-purple-600" />
												)}
												{activity.type === "new_follower" && (
													<Avatar className="h-4 w-4">
														<AvatarFallback className="text-[8px] bg-purple-600 text-white">
															{activity.username?.substring(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
												)}
											</div>
											<div>
												<p className="text-sm">
													{activity.type === "new_message" && (
														<>
															You received{" "}
															<span className="font-medium">
																{activity.count} new messages
															</span>
														</>
													)}
													{activity.type === "profile_view" && (
														<>
															Your profile was viewed{" "}
															<span className="font-medium">
																{activity.count} times
															</span>
														</>
													)}
													{activity.type === "answered" && (
														<>
															You answered{" "}
															<span className="font-medium">
																{activity.count} messages
															</span>
														</>
													)}
													{activity.type === "new_follower" && (
														<>
															<span className="font-medium">
																@{activity.username}
															</span>{" "}
															started following you
														</>
													)}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{activity.date}
												</p>
											</div>
										</div>
									))}
								</CardContent>
								<CardFooter>
									{/* <Link to="/activity" className="text-sm text-purple-600 hover:underline flex items-center">
                    View all activity
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link> */}
								</CardFooter>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Message Stats</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-gray-100 p-4 rounded-lg text-center">
											<p className="text-2xl font-bold text-purple-600">
												{unansweredMessages?.length}
											</p>
											<p className="text-sm text-gray-500">Unanswered</p>
										</div>
										<div className="bg-gray-100 p-4 rounded-lg text-center">
											<p className="text-2xl font-bold text-purple-600">
												{messages?.length}
											</p>
											<p className="text-sm text-gray-500">Total</p>
										</div>
									</div>

									<div className="pt-2">
										<div className="flex justify-between mb-1 text-sm">
											<span>Response Rate</span>
											<span className="font-medium">
												{responseRate}%
											</span>
										</div>
										<div className="w-full bg-gray-200 rounded-full h-2.5">
											<div
												className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full"
												style={{
													width: `${responseRate}%`,
												}}
											></div>
										</div>
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
