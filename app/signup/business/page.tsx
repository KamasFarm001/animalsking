"use client";

import SignUpImage from "@/public/Business-Signup.svg";

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
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { CircularLoader } from "@/components/Loader";
import { signUpBusinessSchema } from "@/lib/zodSchema";
import { signInUser, signUpBusiness } from "@/actions/authActions";
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

export type signInDataType = z.infer<typeof signUpBusinessSchema>;

const Page = () => {
	const form = useForm<signInDataType>({
		resolver: zodResolver(signUpBusinessSchema),
	});

	const { toast } = useToast();
	const router = useRouter();
	const searchParams = useSearchParams();
	const businessId = searchParams.get("businessId") as string;

	const handleGoogleLogin = () => {};

	const onSubmit = async (data: signInDataType) => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (key !== undefined && value !== undefined) {
				formData.append(key, value);
				console.log(formData);
			}
		});
		formData.append("businessId", businessId);
		const rawState = (await signUpBusiness(formData)) as string;
		const state = JSON.parse(rawState);

		if (!state?.success) {
			console.log(state.data);
			toast({
				variant: "destructive",
				title: state?.data.accountType?._errors[0] || state?.data,
				description: "please fix the error and try again.",
			});
		}

		if (state?.success) {
			console.log(state);
			toast({
				title: state?.data.message,
				description: "A verification code has been sent",
			});
			router.push(
				`/signup/business/business-verification?businessId=${state?.data.businessId}`
			);
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
						Create A Business Account
					</h1>
					<FormDescription className="text-center my-5 text-white text-md lg:text-lg">
						Fill in the details to create an account
					</FormDescription>
					<FormField
						control={form.control}
						name="businessName"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										disabled={form.formState.isSubmitting}
										type="text"
										placeholder="Business Name"
										className={cn(
											"bg-transparent focus-visible:ring-0 border-white/40 dark:focus-visible:ring-2  dark:border-gray-500 focus-visible:ring-white dark:focus-visible:ring-ring dark:focus-visible:border-primary/30",

											{
												"focus-visible:ring-red-600 dark:focus-visible:ring-red-600 focus-visible:border-red-600/30 dark:focus-visible:border-red-600/30 dark:border-red-600 border-red-600":
													form.formState.errors.businessName,
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
								<FormItem>
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
						name="accountType"
						render={({ field }) => (
							<FormItem>
								<Select
									disabled={form.formState.isSubmitting}
									onValueChange={field.onChange}
									defaultValue={field.value}
									required
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select Account Type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="merchant">Merchant</SelectItem>
										<SelectItem value="partner">Partner</SelectItem>
									</SelectContent>
								</Select>

								<FormMessage />
							</FormItem>
						)}
					/>

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
						className="mt-5 flex gap-4 bg-[#ddd]/30 enabled:hover:bg-[#ddd]/40 enabled:active:bg-[#ddd]/50 transition-colors text-white"
						type="button"
					>
						SignUp With Google <FcGoogle size={20} />
					</Button>
					<p className="text-center mt-10">
						Already having an account?{" "}
						<Link
							href={"/signin/business"}
							className="font-semibold underline text-deep-green"
						>
							SignIn
						</Link>
					</p>
					<Link
						href={"/signup"}
						className="text-center font-semibold text-deep-green underline"
					>
						Sign up as a user
					</Link>
				</form>
			</Form>
		</main>
	);
};

export default Page;
