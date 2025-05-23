import EmailTemplate from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
	const body = await req.json();
	const { to, subject } = body;
	try {
		const { data, error } = await resend.emails.send({
			from: process.env.NEXT_PUBLIC_RESEND_EMAIL_ADDRESS as string,
			to: [to],
			subject,
			react: EmailTemplate({ ...body }),
		});

		if (error) {
			return Response.json({ success: false, error }, { status: 500 });
		}

		return Response.json({ success: true, data });
	} catch (error) {
		return Response.json({ success: false, error }, { status: 500 });
	}
}
