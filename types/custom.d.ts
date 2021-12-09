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

interface challengesByCategory extends Array<challenge_type> {
	name: string;
	challenges: Array<challenge_type>;
}

interface challengeDetails {
	id: number;
	flag: string;
	min_seconds_btwn_submissions: number;
	case_insensitive: boolean;
	points: number;
	solves: number;
}

interface lastSubmission {
	id: number;
	added: number;
	correct: boolean;
}

interface solvedChallenge {
	added: Date;
	pos: number;
	challengeId: number;
	title: string;
	points: number;
	categoryName: string;
}

interface player_type {
    rank: number;
    id: string;
    username: string;
    points: number;
}

interface userList {
	username: string;
}

interface userRanking {
	position: number;
	username: string;
	score: number;
}

interface announcement {
	id: number;
	added: Date;
	addedBy: string;
	title: string;
	body: string;
}

interface userData {
	id: string;
	username: string;
	image: string;
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