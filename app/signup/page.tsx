"use client";

import SignUpImage from "@/public/signup-img.svg";

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
import { signUpUserSchema } from "@/lib/zodSchema";
import { signUpUser } from "@/actions/authActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/utils";

export type signInDataType = z.infer<typeof signUpUserSchema>;

const Page = () => {
	const form = useForm<signInDataType>({
		resolver: zodResolver(signUpUserSchema),
	});

	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const userId = searchParams.get("userId") as string;

	const handleGoogleLogin = () => {};

	const onSubmit = async (data: signInDataType) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (key !== undefined && value !== undefined) {
				formData.append(key, value);
				console.log(formData);
			}
		});
		formData.append("userId", userId);
		const rawState = (await signUpUser(formData)) as string;
		const state = JSON.parse(rawState);

		if (!state?.success) {
			console.log(state);
			toast({
				variant: "destructive",
				title: state?.data.email?._errors[0] || state?.data,
				description: "fix the error and try again.",
			});
		}

		if (state?.success) {
			console.log(state);
			toast({
				description: state?.data.message,
			});
			router.push(`/signup/user-verification?userId=${state?.data.userId}`);
		}
	};

	return (
		<main className="bg-green-darker h-screen grid grid-cols-1 lg:grid-cols-2">
			<Image
				className="hidden select-none lg:flex h-screen object-cover"
				src={SignUpImage}
				alt="signup"
				priority
			/>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="h-full space-y-5 p-5 lg:p-0 text-white grid place-content-center w-full"
				>
					<h1 className="text-center text-4xl max-w-md lg:text-5xl">
						Create An Account
					</h1>
					<FormDescription className="text-center my-5 text-white text-md lg:text-lg">
						Fill in the details to create an account
					</FormDescription>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										disabled={form.formState.isSubmitting}
										type="text"
										placeholder="Username"
										className={cn(
											"bg-transparent focus-visible:ring-0 border-white/40 dark:focus-visible:ring-2  dark:border-gray-500 focus-visible:ring-white dark:focus-visible:ring-ring dark:focus-visible:border-primary/30",

											{
												"focus-visible:ring-red-600 dark:focus-visible:ring-red-600 focus-visible:border-red-600/30 dark:focus-visible:border-red-600/30 dark:border-red-600 border-red-600":
													form.formState.errors.username,
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
					<div className="flex items-center gap-5">
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem className="w-full h-full">
									<FormControl>
										<Input
											disabled={form.formState.isSubmitting}
											type="phone"
											placeholder="Phone"
											className={cn(
												"bg-transparent focus-visible:ring-0 border-white/40 dark:focus-visible:ring-2  dark:border-gray-500 focus-visible:ring-white dark:focus-visible:ring-ring dark:focus-visible:border-primary/30",

												{
													"focus-visible:ring-red-600 dark:focus-visible:ring-red-600 focus-visible:border-red-600/30 dark:focus-visible:border-red-600/30 dark:border-red-600 border-red-600":
														form.formState.errors.phone,
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
							name="country"
							render={({ field }) => (
								<FormItem className="text-white">
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										required
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Country" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Ghana">Ghana</SelectItem>
											<SelectItem value="Nigeria">Nigeria</SelectItem>
										</SelectContent>
									</Select>

									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full h-full">
								<FormControl>
									<Input
										disabled={form.formState.isSubmitting}
										type="email"
										placeholder="Email"
										className={cn(
											"bg-transparent focus-visible:ring-0 border-white/40 dark:focus-visible:ring-2  dark:border-gray-500 focus-visible:ring-white dark:focus-visible:ring-ring dark:focus-visible:border-primary/30",

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

					<Button
						aria-disabled={form.formState.isSubmitting}
						disabled={form.formState.isSubmitting}
						className="mt-5 bg-primary/60 enabled:hover:bg-primary/70 enabled:active:bg-primary/90 flex gap-4 transition-colors text-white"
						type="submit"
					>
						{form.formState.isSubmitting ? <CircularLoader /> : "Submit"}
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
						className="mt-5 flex gap-1.5 bg-[#ddd]/30 enabled:hover:bg-[#ddd]/40 enabled:active:bg-[#ddd]/50 transition-colors text-white"
						type="button"
					>
						<FcGoogle size={20} />
						SignUp With Google
					</Button>
					<p className="text-center text-white">
						Already having an account?{" "}
						<Link
							href={"/signin"}
							className="font-semibold underline text-deep-green"
						>
							SignIn
						</Link>
					</p>
					<Link
						href={"/signup/business"}
						className="text-center font-semibold text-deep-green underline"
					>
						Sign up as a business
					</Link>
				</form>
			</Form>
		</main>
	);
};

export default Page;
