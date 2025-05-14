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
import { useSearchParams } from "next/navigation";
import { FieldErrors } from "react-hook-form";

const RequestAnewCode = ({
	email,
	setCountDown,
	countdown,
	idType,
	resetError,
	errors,
}: {
	email: string | null;
	setCountDown: React.Dispatch<React.SetStateAction<number>>;
	countdown: number;
	idType: "userId" | "businessId";
	resetError: () => void;
	errors: FieldErrors<{
		oneTimeToken: string;
	}>;
}) => {
	const searchParams = useSearchParams();
	const searchParamsValue = idType === "businessId" ? "businessId" : "userId";

	const resendOtpCode = useMutation({
		mutationKey: [],
		mutationFn: async () => {
			const response = apiConfig.get(
				`/api/${
					idType === "businessId" ? "business" : "users"
				}/requestOtp?${idType}=${searchParams.get(searchParamsValue)}`
			);
			return response;
		},
		onSuccess(data: any) {
			setCountDown(10);
			if (data.status === 429) {
				console.log(data);
				setCountDown(data.data.remainingTime);
				toast({
					variant: "destructive",
					title: data.data.message,
					description: `${data.statusText}. Try again later`,
				});
			} else {
				toast({
					description: data.data.message,
				});
			}
		},
		onError(error: any) {
			console.log(error);
			toast({
				variant: "destructive",
				title: error.response.data.message,
				description: "request a new verification code",
			});
		},
	});

	const handleResend = async () => {
		try {
			///resend code
			if (errors.oneTimeToken) {
				resetError();
			}
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
					<DialogDescription>
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
					</DialogDescription>
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
