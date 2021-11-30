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
	files: Array<String>;
	points: number;
    solves: number;
}
