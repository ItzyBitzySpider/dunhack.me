import { category } from '@prisma/client';

interface challenge_type {
	id: number;
	title: string;
	description: string;
	hash: string;
	service: Boolean;
	ctfName: {
		name: string;
	};
	category: {
		name: string;
	};
	hints: Array<Record<string>>;
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

interface Log {
	id: number;
	added: Date;
	message: string;
	code: string;
	trace: string;
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
	added: Date;
	correct: boolean;
}

interface singleSubmission {
	id: number;
	added: Date;
	challengeId: number;
	userId: string;
	flag: string;
	correct: boolean;
}

interface Submission {
	id: number;
	added: Date;
	challengeId: number;
	userId: string;
	flag: string;
	correct: boolean;
	username: string;
	challengeName: string;
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