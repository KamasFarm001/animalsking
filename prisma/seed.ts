import { PrismaClient, Prisma } from "../app/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

const userData: Prisma.UserCreateInput[] = [
	{
		name: "Alice",
		email: "alice@prisma.io",
		country: "Ghana",
		posts: {
			create: [
				{
					message: "Join the Prisma Discord",
				},
				{
					message: "Prisma on YouTube",
				},
			],
		},
	},
	{
		name: "Bob",
		email: "bob@prisma.io",
		country: "Ghana",
		posts: {
			create: [
				{
					message: "Follow Prisma on Twitter",
				},
			],
		},
	},
];

export async function main() {
	for (const u of userData) {
		await prisma.user.create({ data: u });
	}
}

main();
