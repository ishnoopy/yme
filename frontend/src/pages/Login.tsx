import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";


const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginSchema = z.infer<typeof loginSchema>;

// Tanstack Query
import { login } from "@/components/services/auth";

interface ToastData {
	type: 'error' | 'success' | 'info' | 'warning';
	message: string;
	duration: number;
	position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
	richColors: boolean;
}

export default function LoginPage() {
	const navigate = useNavigate();
	const { setLogin } = useAuth();

	// Check for stored toast message on component mount
	useEffect(() => {
		const storedToast = localStorage.getItem('toastMessage');
		if (storedToast) {
			const toastData: ToastData = JSON.parse(storedToast);
			toast[toastData.type](toastData.message, {
				duration: toastData.duration,
				position: toastData.position,
				richColors: toastData.richColors
			});
			// Clear the stored message
			localStorage.removeItem('toastMessage');
		}
	}, []);

	const mutation = useMutation({
		mutationFn: (data: LoginSchema) => login(data.email, data.password),
		onSuccess: async (data) => {
			toast.success("Login successful! Redirecting...", {
				description: "You will be redirected to your dashboard shortly.",
				duration: 1000,
				position: "top-right",
				richColors: true,
			})

			const { data: {token, user} } = data;

			setLogin(token, user);

			// Redirect to dashboard or home page
			await new Promise((resolve) => setTimeout(resolve, 1000));
			navigate("/feed");
		},
		onError: (error) => {
			toast.error("Login failed: " + error.message, {
				description: "Please check your credentials and try again.",
				duration: 5000,
				position: "top-right",
				richColors: true,
			})
		}
	})

	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const onSubmitHandler = (data: LoginSchema) => {
		mutation.mutate(data);
	}

	return (
		<div className="flex flex-col min-h-screen">
			<main className="flex-1 flex items-center justify-center py-12">
				<div className="container px-4 md:px-6">
					<div className="mx-auto max-w-md space-y-6">
						<div className="space-y-2 text-center">
							<h1 className="text-3xl font-bold">Welcome back</h1>
							<p className="text-gray-500">
								Enter your credentials to access your account
							</p>
						</div>
						<form onSubmit={form.handleSubmit(onSubmitHandler)}>
						<Card>
							<CardContent>
									<div className="space-y-2">
										<Label htmlFor="email">Email</Label>
										<Input
											{...form.register("email")}
											id="email"
											placeholder="m@example.com"
										/>
										{form.formState.errors.email && (
											<span className="text-red-500">
												{form.formState.errors.email.message}
											</span>
										)}
									</div>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<Label htmlFor="password">Password</Label>
											{/* <Link className="text-sm underline" to="/forgot-password">
												Forgot password?
											</Link> */}
										</div>
										<Input
											{...form.register("password")}
											id="password"
											required
											type="password"
										/>
										{form.formState.errors.password && (
											<span className="text-red-500">
												{form.formState.errors.password.message}
											</span>
										)}
									</div>
								</CardContent>
								<CardFooter className="flex flex-col space-y-2">
									<Button
										disabled={mutation.isPending}
										type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
										{mutation.isPending ? "Loading..." : "Login"}
									</Button>
								</CardFooter>
							</Card>
						</form>
						<div className="text-center text-sm">
							Don't have an account?{" "}
							<Link className="underline" to="/signup">
								Sign up
							</Link>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
