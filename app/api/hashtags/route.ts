import { NextResponse } from "next/server";
import Post from "@/models/post";
import connectDb from "@/lib/db";
import { hashtagsRegex } from "@/utils/utils";

//aggregation pipeline to get top 5 hashtags from posts

export const GET = async () => {
	try {
		await connectDb();
		const topHashTags = await Post.aggregate([
			// Match only documents that have content field
			{
				$match: {
					content: { $exists: true, $ne: null },
				},
			},

			// Extract hashtags with a simpler regex pattern
			{
				$project: {
					hashtags: {
						$regexFindAll: {
							input: "$content",
							regex: hashtagsRegex,
						},
					},
				},
			},

			// Unwind the matches array
			{
				$unwind: {
					path: "$hashtags",
					preserveNullAndEmptyArrays: false,
				},
			},

			// Group by the hashtag text and count occurrences
			{
				$group: {
					_id: "$hashtags.match",
					count: { $sum: 1 },
				},
			},

			// Sort by count (desc) and hashtag text (asc)
			{
				$sort: {
					count: -1,
					_id: 1,
				},
			},

			// Limit to top 5
			{ $limit: 5 },

			// Format the output
			{
				$project: {
					_id: 0,
					hashtag: "$_id",
					count: 1,
				},
			},
		]);

		return NextResponse.json({
			success: true,
			topHashTags,
		});
	} catch (error: any) {
		console.error("Error fetching top hashtags:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fetch top hashtags",
				details:
					process.env.NODE_ENV === "development" ? error.message : undefined,
			},
			{ status: 500 }
		);
	}
};
