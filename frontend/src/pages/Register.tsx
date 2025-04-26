import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { EyeOff, Eye } from "lucide-react";
import  { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/components/services/auth";
import { toast } from "sonner";

const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  confirmPassword: z.string().min(8, { message: "Passwords do not match" }),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) { 
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
  }
})

type RegisterSchema = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerForm = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      username: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterSchema) => register(data.email, data.password, data.firstName, data.lastName, data.username),
    onSuccess: async () => {
      toast.success("Account created successfully", {
        description: "Please login to continue",
        duration: 2000,
        position: "top-center",
        richColors: true,
      }); 

      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate("/login");
    }
  })

  const onSubmit = (data: RegisterSchema) => {
    console.log(data);

    registerMutation.mutate(data);
  }
  
	return (
		<>
			<div className="flex flex-col items-center justify-center h-screen">
				<main className="flex-1 flex items-center justify-center py-12">
					<div className="container px-4 md:px-6">
						<div className="mx-auto max-w-md space-y-6">
							<div className="space-y-2 text-center">
								<h1 className="text-3xl font-bold">Create your account</h1>
								<p className="text-gray-500">
									Sign up to start receiving anonymous messages
								</p>
							</div>
							<Card>
								<CardHeader>
									<CardTitle>Register</CardTitle>
									<CardDescription>
										Fill in your details to create your AnonyMsg profile
									</CardDescription>
								</CardHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  registerForm.handleSubmit(onSubmit)();
                }}>

									<CardContent className="space-y-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label htmlFor="firstName">First Name</Label>
                        <Input
                          {...registerForm.register("firstName")}
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                        />
                        {registerForm.formState.errors.firstName && (
                          <p className="text-red-500 text-xs">{registerForm.formState.errors.firstName.message}</p>
                        )}
											</div>
											<div className="space-y-2">
												<Label htmlFor="lastName">Last Name</Label>
                        <Input
                          {...registerForm.register("lastName")}
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                        />
                        {registerForm.formState.errors.lastName && (
                          <p className="text-red-500 text-xs">{registerForm.formState.errors.lastName.message}</p>
                        )}
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="username">Username</Label>
                      <Input
                        {...registerForm.register("username")}
                        id="username"
                        name="username"
                        placeholder="johndoe"
											/>
                        {registerForm.formState.errors.username && (
                          <p className="text-red-500 text-xs">{registerForm.formState.errors.username.message}</p>
                        )}
										</div>

										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
                      <Input
                        {...registerForm.register("email")}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
											/>
                        {registerForm.formState.errors.email && (
                          <p className="text-red-500 text-xs">{registerForm.formState.errors.email.message}</p>
                        )}
										</div>

										<div className="space-y-2">
											<Label htmlFor="password">Password</Label>
											<div className="relative">
												<Input
                          {...registerForm.register("password")}
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
												/>
                        {registerForm.formState.errors.password && (
                          <p className="text-red-500 text-xs">{registerForm.formState.errors.password.message}</p>
                        )}
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 px-3 py-2 text-gray-400 hover:text-gray-600"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
													<span className="sr-only">
														{showPassword ? "Hide password" : "Show password"}
													</span>
												</Button>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="confirmPassword">Confirm Password</Label>
											<div className="relative">
												<Input
                          {...registerForm.register("confirmPassword")}
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
												/>
                        {registerForm.formState.errors.confirmPassword && (
                          <p className="text-red-500 text-xs">{registerForm.formState.errors.confirmPassword.message}</p>
                        )}

                        {/* show custom error if passwords do not match */}
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute right-0 top-0 px-3 py-2 text-gray-400 hover:text-gray-600"
													onClick={() => setShowConfirmPassword(!showConfirmPassword)}
												>
													{showConfirmPassword ? (
													<EyeOff className="h-4 w-4" />
												) : (
													<Eye className="h-4 w-4" />
												)}
												<span className="sr-only">
													{showConfirmPassword
														? "Hide password"
														: "Show password"}
												</span>
												</Button>
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex flex-col space-y-4 mt-4">
										<Button
											type="submit"
											className=" cursor-pointer w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
											disabled={registerForm.formState.isSubmitting}
										>
											{registerForm.formState.isSubmitting ? "Creating Account..." : "Create Account"}
										</Button>
										<div className="text-center text-sm">
											Already have an account?{" "}
											<Link
												className="text-purple-600 hover:underline font-medium"
												to="/login"
											>
												Login
											</Link>
										</div>
									</CardFooter>
								</form>
							</Card>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
