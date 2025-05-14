import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

const connectDb = async () => {
	const connectionState = mongoose.connection.readyState;
	if (connectionState === 1) {
		console.log("Already conected");
	}
	if (connectionState === 2) {
		console.log("Connecting...");
	}
	if (!MONGODB_URI) {
		throw new Error("cannot find MONGODB_URI");
	}

	try {
		mongoose.connect(MONGODB_URI, {
			dbName: "KamasFarms",
			bufferCommands: true,
		});
		console.log("Connected!");
	} catch (error: any) {
		console.log("Error", error);
		throw new Error(error);
	}
};

export default connectDb;
