const Loading = () => {
	return (
		<div className="flex-col fixed inset-0 h-screen bg-background gap-4 w-full flex items-center justify-center">
			<div className="w-20 h-20 border-4 border-transparent text-primary text-4xl animate-spin flex items-center justify-center border-t-primary rounded-full">
				<div className="w-16 h-16 border-4 border-transparent text-foreground text-2xl animate-spin flex items-center justify-center border-t-foreground rounded-full"></div>
			</div>
		</div>
	);
};

export default Loading;
