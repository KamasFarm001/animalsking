import SocialHeader from "@/components/(social)/SocialHeader";
import SocialSidebarLeft from "@/components/(social)/SocialSidebarLeft";

export default function SocialLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="bg-background text-foreground min-h-screen">
			<SocialHeader />
			<div className="flex my-max justify-between mb-[62px] md:mb-0 grow gap-5">
				<SocialSidebarLeft />
				{children}
			</div>
		</div>
	);
}
