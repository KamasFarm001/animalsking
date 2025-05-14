import EmailTemplate from "@/components/email-template";
import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
	const body = await req.json();
	const { to, subject, text, token } = body;
	try {
		const data = body;
		console.log(data);
		// const { data, error } = await resend.emails.send({
		// 	from: "AnimalsKing",
		// 	to: [to],
		// 	subject,
		// 	react: EmailTemplate({ to, subject, text, loginCode: token }),
		// });

		// if (error) {
		// 	return Response.json({ success: false, error }, { status: 500 });
		// }

		return Response.json({ success: true, data });
	} catch (error) {
		return Response.json({ success: false, error }, { status: 500 });
	}
}
