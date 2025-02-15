import { Schema, model, models } from "mongoose";

const PostSchema = new Schema(
	{
		content: { type: String, required: true }, //texts,img or video
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		likes: { type: Number, default: 0 },
		edited: { type: Boolean, default: false },
		shares: { type: Number, default: 0 },
		updated: { type: Boolean, default: false },
		comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	},
	{
		timestamps: true,
	}
);

const Post = models.Post || model("Post", PostSchema);
export default Post;
