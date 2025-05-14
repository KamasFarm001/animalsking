'use client';

import TrendsSidebar from "@/components/(social)/TrendsSidebar";

const Page = () => {
	return (
		<>
			<article className="flex-[5] min-h-screen w-full relative top-3">
				<div className="flex h-fit items-center rounded-sm flex-col p-5 w-full gap-5 justify-center shadow-sm dark:shadow-none shadow-shadow-color dark:border bg-card">
					<div className="max-w-xl w-full">
						<div className="flex items-center gap-2 justify-between scroll-m-20 text-md font-medium tracking-tight">
							<div className="flex flex-col"></div>
						</div>
					</div>
				</div>
			</article>
			<TrendsSidebar />
		</>
	);
};

export default Page;
