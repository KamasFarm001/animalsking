import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
	text: { type: String, required: true },
	from: { Type: Schema.Types.ObjectId, ref: "User", required: true },
	likes: { Type: Number, default: 0 },
	replies: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});

const Comment = models.Comment || model("Comment", CommentSchema);
export default Comment;
