import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "@/components/user-profile";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import ErrorCard from "@/components/error-card";
import { sendMessage } from "@/components/services/message";
import { getUserById } from "@/components/services/user";
import { useAuth } from "@/context/AuthContext";
import { useWebSocket } from "@/context/WebSocketContext";
import { Loader2 } from "lucide-react";

const messageSchema = z.object({
	receiverId: z.string().min(1, "Receiver ID is required"),
	content: z.string().min(1, "Message is required"),
});

type MessageSchema = z.infer<typeof messageSchema>;

export default function Message() {
	const { userId } = useParams<{ userId: string }>();
	const { user: currentUser } = useAuth();
	const { sendMessage: sendNotification } = useWebSocket();

	if (currentUser?.id === userId) {
		toast.error("You cannot send a message to yourself.", {
			duration: 5000,
			position: "top-right",
			richColors: true,
		});

		return (
			<div className="flex flex-col min-h-screen">
				<ErrorCard error="You cannot send a message to yourself." />
			</div>
		)
	}

	const {data:userDetails , isLoading, isError, error } = useQuery({
		queryKey: ["user", userId],
		queryFn: () => getUserById(userId!),
	});

	const form = useForm<MessageSchema>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			receiverId: userId,
			content: "",
		},
	});

	const mutation = useMutation({
		mutationFn: ({ receiverId, content }: MessageSchema) => sendMessage(receiverId, content),
		onSuccess: async (data) => {
			console.log("Message sent successfully✅: ", data);
      toast.success("Message sent successfully!", {
        description: "Your message has been sent anonymously.",
        duration: 5000,
        position: "top-right",
        richColors: true,
			});

			sendNotification({
				type: "notification",
				userId: userId,
				message: "You have a new message!",
			})
      
      // Reset the form after successful submission
			form.reset();
		}
	});

	const onSubmitHandler = async (data: MessageSchema) => {

		mutation.mutate({
      receiverId: data.receiverId,
      content: data.content,
    });
	};

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 flex items-center justify-center py-12">
				<div className="container px-4 md:px-6 flex flex-col gap-4 max-w-screen-lg">
					{isLoading ? (
						<>
							{/* Skeleton for UserProfile */}
							<div className="flex items-center space-y-6 border border-gray-200 rounded-md p-4 shadow-md">
								<Skeleton className="h-16 w-16 rounded-full" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-[120px]" />
									<Skeleton className="h-4 w-[200px]" />
								</div>
							</div>

							{/* Skeleton for message form */}
							<div className="mx-auto w-full space-y-6 border border-gray-200 rounded-md p-4 shadow-md">
								<div className="space-y-2 text-center">
									<Skeleton className="h-8 w-3/4 mx-auto" />
									<Skeleton className="h-4 w-2/3 mx-auto" />
								</div>
								<Skeleton className="h-[200px] w-full rounded-md" />
								<Skeleton className="h-10 w-full rounded-md" />
							</div>
						</>
					) : isError ? (
						<ErrorCard error={error?.message || "Error fetching user"} />
					) : (
						<>
							<UserProfile username={`${userDetails?.data?.profile.username}`} />

							<form onSubmit={form.handleSubmit(onSubmitHandler)}>
								<div className="mx-auto w-full space-y-6 border border-gray-200 rounded-md p-4 shadow-md">
									<div className="space-y-2 text-center">
										<h1 className="text-3xl font-bold">
											Send an anonymous message
										</h1>
										<p className="text-gray-500">
											Your message will be sent anonymously.{" "}
											<span className="text-purple-500 text-lg">{userDetails?.data?.profile.username}</span> will not know who sent it.
										</p>
									</div>
									<Textarea
										{...form.register("content")}
										className="resize-y min-h-[200px] max-h-[400px]"
										placeholder={`Write your anonymous message to ${userDetails?.data?.profile.username}...`}
									/>

									{form.formState.errors.content && (
										<p className="text-red-500 mb-4">
											{form.formState.errors.content.message}
										</p>
									)}
									<Button
										type="submit"
										disabled={form.formState.isSubmitting}
										className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
									>
										{form.formState.isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Send"}
									</Button>
								</div>
							</form>
						</>
					)}
				</div>
			</main>
		</div>
	);
}
