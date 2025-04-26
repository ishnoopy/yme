import { useEffect, useState, useRef } from "react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Clock, MessageSquare, MessageCircle, ArrowUpDown, Twitter, Instagram, X, Facebook } from "lucide-react";
import { Message } from "@/pages/Feed";
import { Button } from "./ui/button";
import { toPng } from 'html-to-image';
import { toast } from "sonner";
import { createRoot } from 'react-dom/client';

// ShareableMessage component for the iframe
const ShareableMessage = ({ message }: { message: Message }) => {
	return (
		<div style={{ 
			backgroundColor: '#ffffff',
			width: '1080px',
			height: '1920px',
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			overflow: 'hidden'
		}}>
			{/* Background gradient */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: 'linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #f0f9ff 100%)',
				opacity: 0.8,
				zIndex: 0
			}} />
			
			{/* Decorative elements */}
			<div style={{
				position: 'absolute',
				top: '20%',
				left: '10%',
				width: '200px',
				height: '200px',
				background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
				borderRadius: '50%'
			}} />
			<div style={{
				position: 'absolute',
				bottom: '20%',
				right: '10%',
				width: '300px',
				height: '300px',
				background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
				borderRadius: '50%'
			}} />

			{/* Content container */}
			<div style={{
				position: 'relative',
				zIndex: 1,
				padding: '4rem',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center'
			}}>
				{/* Message type */}
				<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: '1rem',
					marginBottom: '2rem'
				}}>
					<MessageCircle style={{ 
						height: '2rem', 
						width: '2rem',
						color: '#9333ea'
					}} />
					<span style={{
						fontSize: '1.5rem',
						fontWeight: '600',
						color: '#374151',
						textTransform: 'uppercase',
						letterSpacing: '0.05em'
					}}>
						{message.type === "text" ? "Text Message" : message.type}
					</span>
				</div>

				{/* Message content */}
				<div style={{ 
					background: 'rgba(255, 255, 255, 0.8)',
					backdropFilter: 'blur(10px)',
					padding: '3rem',
					borderRadius: '2rem',
					marginBottom: '3rem',
					boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
				}}>
					<p style={{
						color: '#1f2937',
						fontSize: '2.5rem',
						lineHeight: '1.4',
						fontWeight: '500',
						textAlign: 'center'
					}}>{message.content}</p>
				</div>

				{/* Answer section */}
				{message.answer && (
					<div style={{ 
						background: 'rgba(255, 255, 255, 0.8)',
						backdropFilter: 'blur(10px)',
						padding: '3rem',
						borderRadius: '2rem',
						boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
					}}>
						<div style={{
							display: 'flex',
							alignItems: 'center',
							gap: '2rem',
							marginBottom: '2rem'
						}}>
							<div style={{ 
								height: '5rem',
								width: '5rem',
								borderRadius: '9999px',
								background: 'linear-gradient(135deg, #9333ea, #db2777)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: '#ffffff',
								fontSize: '2rem',
								fontWeight: '600',
								boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
							}}>
								Y
							</div>
							<div>
								<p style={{ 
									fontSize: '1.5rem',
									fontWeight: '600',
									background: 'linear-gradient(135deg, #9333ea, #db2777)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									marginBottom: '0.5rem'
								}}>
									Your Response
								</p>
								<p style={{ 
									color: '#374151',
									fontSize: '2rem',
									lineHeight: '1.4',
									fontWeight: '500'
								}}>
									{message?.answer?.content}
								</p>
							</div>
						</div>
						{message?.answer?.created_at && (
							<div style={{ 
								display: 'flex',
								alignItems: 'center',
								gap: '0.5rem',
								marginTop: '2rem',
								justifyContent: 'center'
							}}>
								<Clock style={{ 
									height: '1.5rem',
									width: '1.5rem',
									color: '#6b7280'
								}} />
								<span style={{
									fontSize: '1.25rem',
									color: '#6b7280',
									fontWeight: '500'
								}}>
									{new Date(message?.answer?.created_at).toLocaleString(undefined, {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit"
									})}
								</span>
							</div>
						)}
					</div>
				)}

				{/* Branding */}
				<div style={{
					position: 'absolute',
					bottom: '2rem',
					left: '50%',
					transform: 'translateX(-50%)',
					display: 'flex',
					alignItems: 'center',
					gap: '0.5rem'
				}}>
					<span style={{
						fontSize: '1.25rem',
						color: '#6b7280',
						fontWeight: '500'
					}}>who-am-i.app</span>
				</div>
			</div>
		</div>
	);
};

export default function AnsweredMessages({
	answeredMessages,
}: {
	answeredMessages: Message[];
}) {
	const [messages, setMessages] = useState<Message[]>(answeredMessages);
	const [sortAscending, setSortAscending] = useState(false);
	const [isGeneratingImage, setIsGeneratingImage] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const sortMessages = (messagesToSort: Message[], sortAscending: boolean) => {
		const sorted = [...messagesToSort].sort((a, b) => {
			const dateA = new Date(a?.answer?.created_at || "");
			const dateB = new Date(b?.answer?.created_at || "");
			return sortAscending
				? dateA.getTime() - dateB.getTime()
				: dateB.getTime() - dateA.getTime();
		});
		return sorted;
	};

	const handleShare = async (message: Message) => {
		if (isGeneratingImage) return;
		setIsGeneratingImage(true);

		try {
			// Create a temporary iframe
			const iframe = document.createElement('iframe');
			iframe.style.position = 'fixed';
			iframe.style.top = '-1000px'; // Move it far off screen
			iframe.style.left = '-1000px';
			iframe.style.width = '1080px';
			iframe.style.height = '1920px';
			iframe.style.border = 'none';
			iframe.style.opacity = '0';
			iframe.style.visibility = 'hidden';
			iframe.style.pointerEvents = 'none';
			iframe.style.zIndex = '-1000';
			document.body.appendChild(iframe);

			// Create a temporary div to hold the content
			const contentDiv = document.createElement('div');
			contentDiv.style.width = '100%';
			contentDiv.style.height = '100%';
			iframe.contentDocument?.body.appendChild(contentDiv);

			// Add necessary styles to the iframe document
			const style = document.createElement('style');
			style.textContent = `
				body { margin: 0; padding: 0; }
				* { box-sizing: border-box; }
			`;
			iframe.contentDocument?.head.appendChild(style);

			// Render the ShareableMessage component in the iframe
			const root = document.createElement('div');
			contentDiv.appendChild(root);
			const reactRoot = createRoot(root);
			reactRoot.render(<ShareableMessage message={message} />);

			// Wait for the content to render
			await new Promise(resolve => setTimeout(resolve, 100));

			// Capture the iframe content
			const dataUrl = await toPng(contentDiv, {
				quality: 1,
				pixelRatio: 2,
				backgroundColor: '#ffffff',
				style: {
					padding: '20px',
					borderRadius: '12px',
				}
			});

			// Create a temporary link to download the image
			const link = document.createElement('a');
			link.download = `message-${message.id}.png`;
			link.href = dataUrl;
			link.click();

			toast.success("Image downloaded! You can now share it on Social Media", {
				duration: 3000,
			});

			// Clean up
			reactRoot.unmount();
			document.body.removeChild(iframe);
		} catch (error) {
			console.error('Screenshot error:', error);
			toast.error("Failed to create shareable image", {
				duration: 3000,
			});
		} finally {
			setIsGeneratingImage(false);
		}
	};

	useEffect(() => {
		setMessages(sortMessages(answeredMessages, sortAscending));
	}, [sortAscending, answeredMessages]);

	return (
		<>
			<Card className="border-0 shadow-lg">
				<CardHeader className="space-y-1">
					<div className="flex justify-between items-center">
						<CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
							Answered Messages
						</CardTitle>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setSortAscending(!sortAscending)}
							className="flex items-center gap-2"
						>
							<ArrowUpDown className="h-4 w-4" />
							Answered {sortAscending ? "Newest" : "Oldest"}
						</Button>
					</div>
					<CardDescription className="text-gray-500">
						Your thoughtful responses to received messages
					</CardDescription>
				</CardHeader>
				<div
					className="
					flex flex-col
					gap-4
					overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent"
				>
					{answeredMessages?.length === 0 ? (
						<div className="animate-fade-in flex flex-col items-center justify-center h-full min-h-[400px]">
							<h3 className="text-xl font-semibold mb-3 text-gray-800">
								No answered messages yet 🥺
							</h3>
							<p className="text-gray-500 max-w-md leading-relaxed text-sm">
								When you answer messages, they'll appear here. Start engaging
								with your community by checking your inbox.
							</p>
						</div>
					) : (
						<>
							{messages?.map((message) => (
								<div
									key={message.id}
									className="bg-white p-6 shadow-lg rounded-xl relative border border-gray-100 w-full hover:shadow-xl transition-shadow duration-200"
								>
									{/* Visible message content */}
									<div className="flex justify-between items-center mb-4">
										<div className="flex items-center gap-2">
											<MessageCircle className="h-4 w-4 text-purple-500" />
											<span className="text-sm font-medium text-gray-700">
												{message.type === "text" ? "Text Message" : message.type}
											</span>
										</div>
										<p className="text-xs text-gray-500 flex items-center">
											<Clock className="h-3 w-3 mr-1" />
											{message.created_at}
										</p>
									</div>

									<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg mb-4">
										<p className="text-gray-800 leading-relaxed">
											{message.content}
										</p>
									</div>

									{message.answer && (
										<div className="mt-6 border-t border-gray-100 pt-6">
											<div className="flex items-start gap-4">
												<div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0 shadow-md">
													Y
												</div>
												<div className="flex-1 text-start">
													<p className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
														Your Response
													</p>
													<p className="text-gray-700 mt-2 leading-relaxed">
														{message?.answer?.content}
													</p>
													{message?.answer?.created_at && (
														<p className="text-xs text-gray-500 mt-2 flex items-center">
															<Clock className="h-3 w-3 mr-1" />
															answered at {new Date(message?.answer?.created_at).toLocaleString(undefined, {
																year: "numeric",
																month: "long",
																day: "numeric",
																hour: "2-digit",
																minute: "2-digit"
															})}
														</p>
													)}
												</div>
											</div>
										</div>
									)}
									
									<div className="flex justify-end items-center mt-4">
										<Button 
											variant="outline" 
											size="sm" 
											className={`flex items-center gap-2 cursor-pointer ${isGeneratingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
											onClick={() => handleShare(message)}
											disabled={isGeneratingImage}
										>
											{isGeneratingImage ? (
												<>
													Generating... <Clock className="h-4 w-4 animate-spin" />
												</>
											) : (
												<>
													Share <Instagram className="h-4 w-4" /> <X className="h-4 w-4" /> <Facebook className="h-4 w-4" />
												</>
											)}
										</Button>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			</Card>
		</>
	);
}
