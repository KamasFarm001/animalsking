"use client";

import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import React from "react";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { oneTimeTokenSchema } from "@/lib/zodSchema";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import RequestAnewCode from "@/components/RequestAnewCode";
import { cn } from "@/utils/utils";
import { signIn } from "next-auth/react";
import apiConfig from "@/utils/axiosConfig";

export type verificationToken = z.infer<typeof oneTimeTokenSchema>;

const Page = () => {
	const form = useForm<z.infer<typeof oneTimeTokenSchema>>({
		resolver: zodResolver(oneTimeTokenSchema),
		defaultValues: {
			oneTimeToken: "",
		},
	});

	const searchParams = useSearchParams();
	const router = useRouter();
	const userId = searchParams.get("userId") as string;
	const [email, setEmail] = useState("");
	const [countdown, setCountDown] = useState(0);

	async function onSubmit(data: verificationToken) {
		setEmail("");
		//signin here

		try {
			const signInResponse = await signIn("credentials", {
				otp: data.oneTimeToken,
				userId,
				callbackUrl: "/",
				redirect: false,
			});
			if (form.formState.isSubmitting) {
				toast({
					variant: "default",
					title: "Verifying Your Token...",
					description: (
						<p className="text-foreground text-md flex items-center gap-4">
							<span>Please wait while we confirm your token.</span>{" "}
							<Loader className="w-5 h-5" />
						</p>
					),
				});
			}

			if (signInResponse?.error) {
				form.setError("oneTimeToken", { message: signInResponse?.error });

				const getEmail = await apiConfig.get(
					`/api/users/${userId}?projections={"email":1}`
				);
				setEmail(getEmail?.data?.user?.email);
				setCountDown((prev) => prev + 15);
				toast({
					variant: "destructive",
					title: signInResponse?.error,
					description: "request a new verification code",
				});
			}
			if (signInResponse?.ok) {
				setCountDown((prev) => prev + 10);
				console.log(signInResponse);
				toast({
					description: "You are authenticated",
				});
				router.push("/");
			}
		} catch (error: any) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (!userId) {
			router.push("/signin");
		}
	}, [userId, router]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCountDown(countdown == 0 ? 0 : countdown - 1);
		}, 1000);
		return () => {
			clearTimeout(timer);
		};
	}, [countdown]);

	return (
		<main className="relative bg-green-darker text-foreground h-screen grid place-content-center">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-[70%] mx-auto space-y-6"
				>
					<FormField
						control={form.control}
						name="oneTimeToken"
						render={({ field }) => (
							<FormItem className="text-white">
								<FormLabel className="font-medium">
									One-Time Verification code
								</FormLabel>
								<FormControl>
									<InputOTP maxLength={6} {...field}>
										<InputOTPGroup>
											<InputOTPSlot
												aria-disabled={form.formState.isSubmitting}
												aria-required
												className={cn(
													`h-12 w-12 ring-white dark:ring-ring border-gray-600`,
													{
														"border-red-600":
															form.formState.errors.oneTimeToken || email, //if an error exist an email will also exist
													}
												)}
												index={0}
											/>
											<InputOTPSlot
												aria-disabled={form.formState.isSubmitting}
												aria-required
												className={cn(
													`h-12 w-12 ring-white dark:ring-ring border-gray-600`,
													{
														"border-red-600":
															form.formState.errors.oneTimeToken || email, //if an error exist an email will also exist
													}
												)}
												index={1}
											/>
											<InputOTPSlot
												aria-disabled={form.formState.isSubmitting}
												aria-required
												className={cn(
													`h-12 w-12 ring-white dark:ring-ring border-gray-600`,
													{
														"border-red-600":
															form.formState.errors.oneTimeToken || email, //if an error exist an email will also exist
													}
												)}
												index={2}
											/>
										</InputOTPGroup>
										<InputOTPSeparator className="mx-2" />
										<InputOTPGroup>
											<InputOTPSlot
												aria-disabled={form.formState.isSubmitting}
												aria-required
												className={cn(
													`h-12 w-12 ring-white dark:ring-ring border-gray-600`,
													{
														"border-red-600":
															form.formState.errors.oneTimeToken || email, //if an error exist an email will also exist
													}
												)}
												index={3}
											/>
											<InputOTPSlot
												aria-disabled={form.formState.isSubmitting}
												aria-required
												className={cn(
													`h-12 w-12 ring-white dark:ring-ring border-gray-600`,
													{
														"border-red-600":
															form.formState.errors.oneTimeToken || email, //if an error exist an email will also exist
													}
												)}
												index={4}
											/>
											<InputOTPSlot
												aria-disabled={form.formState.isSubmitting}
												aria-required
												className={cn(
													`h-12 w-12 ring-white dark:ring-ring border-gray-600`,
													{
														"border-red-600":
															form.formState.errors.oneTimeToken || email, //if an error exist an email will also exist
													}
												)}
												index={5}
											/>
										</InputOTPGroup>
									</InputOTP>
								</FormControl>
								<FormDescription>
									Please enter the one-time verification code we sent to your
									email.{" "}
									{countdown >= 1 && (
										<>
											To request a new code
											<span className="text-deep-green">
												{" "}
												wait in {countdown >= 2 ? countdown + "s" : countdown}
											</span>{" "}
										</>
									)}
									<RequestAnewCode
										idType="userId"
										countdown={countdown}
										resetError={() => form.clearErrors("oneTimeToken")}
										errors={form.formState.errors}
										email={email}
										setCountDown={setCountDown}
									/>
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						aria-disabled={form.formState.isSubmitting}
						className="mt-5 bg-primary/60 hover:bg-primary/70 active:bg-primary/90 flex gap-4 transition-colors text-white"
						type="submit"
					>
						{form.formState.isSubmitting ? <Loader /> : "Confirm"}
					</Button>
				</form>
			</Form>
			{email && (
				<p className="absolute text-white bottom-20 left-1/2 -translate-x-1/2">
					Having any problems?{" "}
					<Link className="text-green-600" href="/contact-support">
						Contact Support
					</Link>
				</p>
			)}
		</main>
	);
};

export default Page;
