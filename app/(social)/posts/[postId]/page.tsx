import TrendsSidebar from "@/components/(social)/TrendsSidebar";
import TargetPostClientPage from "@/components/(social)/TargetPostClientPage";

const Page = ({ params }: { params: { postId: string } }) => {
	return (
		<>
			<TargetPostClientPage postId={params.postId} />
			<TrendsSidebar />
		</>
	);
};

export default Page;
