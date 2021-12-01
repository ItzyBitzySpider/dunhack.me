import { category } from '@prisma/client';

interface challenge_type {
	id: number;
	title: String;
	description: String;
	ctfName: {
		name: String;
	};
	category: {
		name: String;
	};
	hints: Array<Record<String>>;
	files: Array<{
		title: String;
		url: String;
	}>;
	points: number;
    solves: number;
}

interface player_type {
    rank: number;
    id: String;
    username: String;
    points: number;
}