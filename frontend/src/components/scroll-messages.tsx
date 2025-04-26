"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Reply, MessageSquare, X, Mail, Clock, SendIcon, Loader2 } from "lucide-react";
import { Message } from "@/pages/Feed";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMessage } from "./services/message";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import answerMessage from "./services/answer";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AnswerSchema = z.object({
	messageId: z.string(),
	userId: z.string(),
	content: z.string().min(1, "Content is required"),
});

type AnswerSchema = z.infer<typeof AnswerSchema>;

export default function ScrollMessages({ messages }: { messages: Message[] }) {
	const navigate = useNavigate();
	const [openedMessage, setOpenedMessage] = useState<Message | null>(null);

	const { user } = useAuth();
	const [openedAnswer, setOpenedAnswer] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const form = useForm<AnswerSchema>({
		resolver: zodResolver(AnswerSchema),
		defaultValues: {
			messageId: "",
			userId: user?.id || "",
			content: "",
		},
	});

	const unopenedMessages = messages?.filter(
		(message) => message?.is_viewed === false
	);

	const viewMessageMutation = useMutation({
		mutationFn: ({
			id,
			content,
			is_viewed,
			is_answered,
		}: {
			id: string;
			content?: string;
			is_viewed?: boolean;
			is_answered?: boolean;
		}) => updateMessage(id, content, is_viewed, is_answered),
		mutationKey: ["messages"],
	});

	const answerMessageMutation = useMutation({
		mutationFn: ({
			messageId,
			userId,
			content,
		}: {
			messageId: string;
			userId: string;
			content: string;
		}) => answerMessage(messageId, userId, content),
		mutationKey: ["messages"],
	});

	const openMessage = (message: Message) => {
		viewMessageMutation.mutate(
			{
				id: message?.id,
				is_viewed: true,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["messages"],
					});
					toast.success("Message opened", {
						duration: 2000,
						richColors: true,
					});
				},
				onError: () => {
					toast.error("Failed to open message", {
						duration: 2000,
						richColors: true,
					});
				},
			}
		);
	};

	const sendAnswer = async (data: AnswerSchema) => {

		answerMessageMutation.mutate(
			{
				messageId: openedMessage?.id || "",
				userId: data?.userId,
				content: data?.content,
			},
			{
				onSuccess: async () => {
					queryClient.invalidateQueries({
						queryKey: ["messages"],
					});

					toast.success("Answer sent successfully", {
						duration: 2000,
						richColors: true,
						position: "top-right",
					});

					setOpenedAnswer(false);
					form.reset();

					navigate(`/feed?tab=answered`);
				},
			}
		);
	};

	const toggleMessage = (message: Message, is_viewed: boolean) => {
		if (openedMessage?.id === message?.id) {
			setOpenedMessage(null);
		} else {
			setOpenedMessage(message);

			if (!is_viewed) {
				openMessage(message);
			}
		}
	};

	return (
		<div className="space-y-6">
			<div className="relative">
				<div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-32 h-8 bg-blue-100 rounded-full flex items-center justify-center z-10">
					<p className="text-blue-800 text-sm font-medium">Inbox</p>
				</div>

				{openedMessage !== null ? (
					// Opened message view
					<div className="bg-white rounded-lg p-6 pt-8 shadow-md relative">
						{messages
							.filter((message) => message?.id === openedMessage?.id)
							.map((message) => (
								<div key={message?.id} className="w-full max-w-md mx-auto">
									<div className="bg-white p-4 shadow-md rounded-md relative border border-gray-200">
										<div className="flex justify-between items-start mb-3">
											<p className="text-xs text-gray-500 flex items-center">
												<Clock className="h-3 w-3 mr-1" />
												{message?.created_at}
											</p>
											<Button
												variant="ghost"
												size="icon"
												className="h-6 w-6 cursor-pointer"
												onClick={() => {
													setOpenedMessage(null);
													setOpenedAnswer(false);
													form.reset();
												}}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>

										{message?.content && (
											<div className="bg-gray-50 p-4 rounded-md mb-4">
												<p className="text-gray-800">{message?.content}</p>
											</div>
										)}

										<div className="flex justify-end">
											<Button
												size="sm"
												className="cursor-pointer gap-1 bg-gradient-to-r from-purple-600 to-pink-600"
												onClick={() => setOpenedAnswer(true)}
												disabled={message?.is_answered || openedAnswer}
											>
												<Reply className="h-3 w-3" />
												Answer
											</Button>
										</div>
									</div>

									{/* Message actions */}
									{openedAnswer && (
										<div className="bg-white p-4 shadow-md rounded-md relative border border-gray-200 mt-4">
											<div className="flex justify-between items-center">
												<span className="text-sm font-medium text-purple-600">
													Your answer:
												</span>
												<Button
													variant="ghost"
													size="icon"
													className="h-6 w-6 cursor-pointer"
													onClick={() => {
														setOpenedAnswer(false);
														form.reset();
													}}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>

											<div className="mt-4">
												<form
													onSubmit={(e) => {
														e.preventDefault();
														e.stopPropagation();

														form.handleSubmit(sendAnswer)();
													}}
												>
													<Textarea
														{...form.register("content")}
														className="w-full p-2 border border-gray-300 rounded-md"
														placeholder="Write your response..."
													/>

													<p className="text-red-500 text-sm mt-2">
														{form.formState.errors.content?.message}
													</p>

													<div className="flex justify-end mt-2 gap-2">
														<Button
															variant="outline"
															size="sm"
															className="cursor-pointer"
															onClick={() => {
																setOpenedAnswer(false);
																form.reset();
															}}
														>
															Cancel
														</Button>
														<Button
															size="sm"
															className="cursor-pointer gap-1 bg-gradient-to-r from-purple-600 to-pink-600"
															disabled={form.formState.isSubmitting}
														>
															{form.formState.isSubmitting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <SendIcon className="h-3 w-3" />}
															Send Reply
														</Button>
													</div>
												</form>
											</div>
										</div>
									)}
								</div>
							))}
					</div>
				) : messages?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-gray-200 rounded-md">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                No messages in your inbox yet 🦉
              </h3>
						<p className="text-gray-500 max-w-md leading-relaxed text-sm">
							Start receiving anonymous messages by sharing your profile link with others.
						</p>
					</div>
				) : (
					// Grid of Envelopes
					<div className="bg-white rounded-lg p-6 pt-8 shadow-md relative border border-gray-200">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
							{messages?.map((message) => (
								<div
									key={message?.id}
									className="transition-all duration-200 hover:shadow-md cursor-pointer"
									onClick={() => toggleMessage(message, message?.is_viewed)}
								>
									{/* Envelope */}
									<div className="bg-white border border-gray-200 rounded-md overflow-hidden">
										{/* Envelope top part (flap) */}
										<div className="relative h-3 bg-gray-50 border-b border-gray-200">
											<div
												className="absolute w-full h-3 bg-gray-50"
												style={{
													clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
												}}
											></div>
										</div>

										{/* Envelope body */}
										<div className="p-4 flex items-center">
											<div className="mr-3 bg-purple-100 p-2 rounded-full">
												<MessageSquare className="h-4 w-4 text-purple-600" />
											</div>
											<div className="flex-1">
												<div className="flex items-center justify-between">
													<p className="text-sm font-medium text-gray-800">
														New text message
													</p>
													{message?.is_viewed === false && (
														<div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
													)}
												</div>
												<p className="text-xs text-gray-500 flex items-center mt-1">
													<Clock className="h-3 w-3 mr-1" />
													{message?.created_at}
												</p>
											</div>
										</div>

										{/* Envelope bottom part */}
										<div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
											<div className="flex items-center">
												<Mail className="h-3 w-3 text-gray-400 mr-1" />
												{message?.is_viewed === false && (
													<span className="text-xs text-gray-500">
														Unopened
													</span>
												)}
											</div>
											<Button
												variant="ghost"
												size="sm"
												className="h-6 px-2 text-xs cursor-pointer text-purple-600 hover:text-purple-700"
											>
												Open
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="flex justify-between items-center px-2">
				<p className="text-sm text-gray-500">
					<span className="font-medium text-purple-600">
						{unopenedMessages?.length}
					</span>{" "}
					unopened messages
				</p>
				{/* <Button variant="outline" size="sm" className="gap-1">
          Mark all as read
        </Button> */}
			</div>
		</div>
	);
}
