"use client";
import React from "react";

import { MailQuestion } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import apiConfig from "@/utils/axiosConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { FieldErrors } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { emailSchema } from "@/lib/zodSchema";

const RequestAnewCode = ({
	email,
	setCountDown,
	countdown,
	idType,
	resetError,
	errors,
	resetFields,
}: {
	email: string | null;
	setCountDown: React.Dispatch<React.SetStateAction<number>>;
	countdown: number;
	idType: "userId" | "businessId";
	resetError: () => void;
	errors: FieldErrors<{
		oneTimeToken: string;
	}>;
	resetFields: () => void;
}) => {
	const router = useRouter();

	const resendOtpCode = useMutation({
		mutationKey: [],
		mutationFn: async () => {
			const response = await authClient.emailOtp.sendVerificationOtp({
				email: email!,
				type: "sign-in", // or "email-verification", "forget-password"
			});
			return response;
		},
		onSuccess() {
			setCountDown(20);
			toast({
				description: "Verification code has been sent",
			});
		},
		onError(error: any) {
			console.log(error);
			toast({
				variant: "destructive",
				title: error.message,
				description: "Something went wrong",
			});
		},
	});

	const handleResend = async () => {
		const emailValidation = emailSchema.safeParse({ email });
		if (emailValidation.error) {
			toast({
				variant: "destructive",
				title: "Invalid email",
				description: emailValidation.error.format().email?._errors[0],
			});
			router.push(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/signup`);
		}
		try {
			///resend code
			if (errors.oneTimeToken) {
				resetError();
			}
			resetFields();
			resendOtpCode.mutate();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Dialog>
			{countdown <= 0 && (
				<>
					<DialogTrigger
						className="underline text-deep-green"
						onClick={handleResend}
					>
						Request a new code
					</DialogTrigger>
				</>
			)}
			<DialogContent>
				<DialogHeader>
					{" "}
					<MailQuestion
						size={40}
						className="text-mid--yellow mx-auto mb-3 leading-tight"
					/>
					<DialogTitle>
						{`Didn't `}Receive the email verification code?
					</DialogTitle>
					<DialogDescription>
						Email verification has been sent. If you have not received the
						verification code after several attempts, please try the following:
					</DialogDescription>
					<div>
						<ul className="list-decimal list-inside font-normal">
							<li>
								Check if it is in your
								<span className="text-mid--yellow"> Spam / junk </span> mail.
							</li>
							{email && (
								<li>
									Make sure your email address is{" "}
									<span className="text-mid--yellow">{email}</span> .
								</li>
							)}
							<li>
								The verification code may have been delayed for a few minutes.
								Try again after a few minutes
							</li>
						</ul>
					</div>
				</DialogHeader>
				<DialogClose
					className="w-full rounded-sm active:scale-[1.01] text-center bg-primary hover:bg-primary/70 active:bg-primary/90 bg-brand-green/60 hover:bg-brand-green/70 ease transition-colors duration-100 p-2 font-medium mt-5 text-white "
					type="button"
				>
					OK
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
};

export default RequestAnewCode;
