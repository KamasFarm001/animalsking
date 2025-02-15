import Notification from "@/components/(social)/Notification";
import TrendsSidebar from "@/components/(social)/TrendsSidebar";

const page = () => {
	return (
		<>
			<main className="flex-[4] px-5 space-y-5 md:px-0 lg:px-5 ">
				<Notification />
				<Notification />
			</main>
			<TrendsSidebar />
		</>
	);
};

export default page;
