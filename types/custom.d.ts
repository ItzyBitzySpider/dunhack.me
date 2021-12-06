import { category } from '@prisma/client';

interface challenge_type {
	id: number;
	title: string;
	description: string;
	ctfName: {
		name: string;
	};
	category: {
		name: string;
	};
	hints: Array<Record<String>>;
	files: Array<{
		title: string;
		url: string;
	}>;
	points: number;
    solves: number;
}

interface player_type {
    rank: number;
    id: string;
    username: string;
    points: number;
}

interface Session extends Record<string, unknown> {
    user?: {
		id?: string | null;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    expires: ISODateString;
}