import mongoose, { Schema, model, models } from "mongoose";

const followerSchema = new Schema(
	{
		followerId: { type: Schema.Types.ObjectId, ref: "User" },
		followingId: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
	}
);

// a unique composite index
followerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follower = models.Follower || model("Follower", followerSchema);
export default Follower;
