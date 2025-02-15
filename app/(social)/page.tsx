import PostAContent from "@/components/(social)/PostAContent";
import TrendsSidebar from "@/components/(social)/TrendsSidebar";
import FollowingFeed from "@/components/(social)/FollowingFeed";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForYouFeed from "./ForYouFeed";
export default function Home() {
	return (
		<>
			<main className="flex-[5] mb-5 relative top-3 my-max px-5 md:px-0 lg:px-5 min-h-screen">
				<PostAContent />
				<Tabs className="w-full " defaultValue="foryou">
					<TabsList className="shadow-sm dark:shadow-none dark:border grid w-full h-14 grid-cols-2 my-5">
						<TabsTrigger className="h-full" value="foryou">
							For you
						</TabsTrigger>
						<TabsTrigger value="following" className="h-full">
							Following
						</TabsTrigger>
					</TabsList>
					<TabsContent value="foryou" className="flex gap-5 flex-col">
						<ForYouFeed />
					</TabsContent>
					<TabsContent value="following" className="flex gap-5 flex-col">
						<FollowingFeed />
					</TabsContent>
				</Tabs>
			</main>
			<TrendsSidebar />
		</>
	);
}
