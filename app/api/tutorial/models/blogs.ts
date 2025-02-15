import { model, models, Schema } from "mongoose";

const blogSchema = new Schema(
	{
		title: { type: "string", required: true },
		description: { type: "string" },
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
	},
	{ timestamps: true }
);

const Blogs = models.Blog || model("Blog", blogSchema);
export default Blogs;
