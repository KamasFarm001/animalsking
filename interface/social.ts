export interface IComments {
	_id: string;
}

export interface IPostPage {
	posts: IPost[];
	nextCursor: string;
	hasNextPage?: boolean;
}

export interface IPost {
	_id: string;
	content: string;
	author: {
		_id: string;
		username: string;
		email: string;
		avatarUrl: string;
		displayName: string;
		accountType: "personal" | "business";
		followersCount: string[];
		followingCount: string[];
		followers: string[];
		following: string[];
		bio: string;
	};
	likes: number;
	edited: boolean;
	shares: number;
	comments: IComments[];
	updated: boolean;
	createdAt: string;
	updatedAt: string;
	postCount?: number;
}

export interface IUser {
	avatarUrl: string;
	displayName: string;
	_id: string;
	email: string;
	username: string;
	hasVerifiedAccount: boolean;
	phone: string;
	country: string;
	businesses: string[];
	createdAt: string;
	updatedAt: string;
	accountType: "personal" | "business";
	followers: string[];
	following: string[];
	bio: string;
}

export interface IFollowers {
	isFollowedByUser: boolean;
	isFollowingUser: boolean;
	followersCount: number;
	followingCount: number;
	followers: string[];
	following: string[];
}
