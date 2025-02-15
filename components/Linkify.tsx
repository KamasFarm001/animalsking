import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";

interface LinkifyProps {
	children: React.ReactNode;
	userId?: string;
}

const Linkify = ({ children, userId }: LinkifyProps) => {
	return (
		<LinkifyUsername userId={userId}>
			<LinkifyHashTags>
				<LinkifyUrl>{children}</LinkifyUrl>
			</LinkifyHashTags>
		</LinkifyUsername>
	);
};

const LinkifyUrl = ({ children }: LinkifyProps) => {
	return (
		<LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
	);
};

const LinkifyUsername = ({ children, userId }: LinkifyProps) => {
	return (
		<LinkIt
			component={(match, key) => {
				return (
					<Link
						key={key}
						className="text-primary hover:underline"
						href={`/users/${userId}`}
					>
						{match}
					</Link>
				);
			}}
			regex={/(@[a-zA-Z0-9_-]+)/}
		>
			{children}
		</LinkIt>
	);
};
const LinkifyHashTags = ({ children }: LinkifyProps) => {
	return (
		<LinkIt
			component={(match, key) => {
				return (
					<Link
						key={key}
						className="text-primary hover:underline"
						href={`/hashtags/${match.slice(1)}`}
					>
						{match}
					</Link>
				);
			}}
			regex={/(^|\s)(#[a-zA-Z0-9]+)/g}
		>
			{children}
		</LinkIt>
	);
};

export default Linkify;
