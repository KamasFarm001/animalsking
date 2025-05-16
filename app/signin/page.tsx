"use client";

import SignInIMage from "@/public/login-img.svg";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { CircularLoader } from "@/components/Loader";
import { signInSchema } from "@/lib/zodSchema";
import { signInUser } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/utils/utils";
export type signInDataType = z.infer<typeof signInSchema>;

const Page = () => {
	const form = useForm<signInDataType>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { toast } = useToast();
	const router = useRouter();

	const handleGoogleLogin = () => {};

	const onSubmit = async (data: signInDataType) => {
		try {
			const formData = new FormData();
			formData.append("email", data.email);
			formData.append("password", data.password);

			const rawState = await signInUser(formData);
			const state = JSON.parse(rawState);

			if (!state?.success) {
				if (state.data.code === "INVALID_EMAIL_OR_PASSWORD") {
					toast({
						variant: "destructive",
						title: state.data.message,
						description: "invalid email or password",
					});
				} else {
					toast({
						variant: "destructive",
						title: state.data.message,
						description: "please fix the error and try again.",
					});
				}
			}

			if (state?.success) {
				console.log(state);
				toast({
					variant: "default",
					title: state.data,
					description: state?.data.message,
				});
				router.push("/");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<main className="bg-green-darker h-screen grid grid-cols-1 lg:grid-cols-2">
			<Image
				className="hidden select-none lg:flex h-screen object-cover"
				src={SignInIMage}
				alt="signin"
				priority
			/>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="h-full max-w-md space-y-5 p-5 lg:p-0 text-white grid content-center mx-auto w-full"
				>
					<h1 className="text-center text-4xl lg:text-5xl">SignIn As A User</h1>
					<FormDescription className="text-center my-5 text-white text-md lg:text-lg">
						Fill in your details to login to your account
					</FormDescription>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										disabled={form.formState.isSubmitting}
										type="email"
										placeholder="email"
										className={cn(
											"bg-transparent focus-visible:ring-0 dark:focus-visible:ring-2  dark:border-gray-500 focus-visible:ring-white dark:focus-visible:ring-ring dark:focus-visible:border-primary/30",

											{
												"focus-visible:ring-red-600 dark:focus-visible:ring-red-600 focus-visible:border-red-600/30 dark:focus-visible:border-red-600/30 dark:border-red-600 border-red-600":
													form.formState.errors.email,
											}
										)}
										{...field}
										required
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										disabled={form.formState.isSubmitting}
										type="password"
										placeholder="password"
										className={cn(
											"bg-transparent focus-visible:ring-0 dark:focus-visible:ring-2  dark:border-gray-500 focus-visible:ring-white dark:focus-visible:ring-ring dark:focus-visible:border-primary/30",

											{
												"focus-visible:ring-red-600 dark:focus-visible:ring-red-600 focus-visible:border-red-600/30 dark:focus-visible:border-red-600/30 dark:border-red-600 border-red-600":
													form.formState.errors.password,
											}
										)}
										{...field}
										required
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						aria-disabled={form.formState.isSubmitting}
						disabled={form.formState.isSubmitting}
						className="mt-5 bg-primary/60 text-white enabled:hover:bg-primary/70 enabled:active:bg-primary/90 flex gap-4 transition-colors"
						type="submit"
					>
						{form.formState.isSubmitting ? <CircularLoader /> : "Sign in"}
					</Button>

					<div className="flex my-3 items-center justify-center w-full">
						<div className=" w-full h-[1px] [background:linear-gradient(to_right,#a3a3a3,#050d0a)]"></div>
						<span className="text-grey-lightest">or</span>
						<div className=" w-full h-[1px] [background:linear-gradient(to_left,#a3a3a3,#050d0a)]"></div>
					</div>

					<Button
						aria-disabled={form.formState.isSubmitting}
						disabled={form.formState.isSubmitting}
						onClick={handleGoogleLogin}
						className="mt-5 text-white flex gap-4 bg-[#ddd]/30 enabled:hover:bg-[#ddd]/40 enabled:active:bg-[#ddd]/50 transition-colors"
						type="button"
					>
						Login With Google <FcGoogle size={20} />
					</Button>
					<p className="text-center mt-10">
						{`Don't`} have an account?{" "}
						<Link
							href={"/signup"}
							className="font-semibold underline text-deep-green"
						>
							SignUp
						</Link>
					</p>
					<Link
						href={"/signin/business"}
						className="text-center font-semibold text-deep-green underline"
					>
						Sign in as a business
					</Link>
				</form>
			</Form>
		</main>
	);
};

export default Page;
