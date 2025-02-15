import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
	{
		productName: { type: String, required: true },
		img: { type: String, required: true },
		desc: { type: String, required: true },
		owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
		phone: { type: String, required: true },
		ownerEmail: { type: String, required: true },
		country: { type: String },
		location: { type: String },
		category: {
			type: String,
			enum: ["crop", "livestock", "mixed"],
			default: "crop",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Product = models.Product || model("Product", productSchema);
export default Product;
