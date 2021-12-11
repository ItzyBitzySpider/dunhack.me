import { getSession, useSession } from 'next-auth/react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Challenge from '../components/challenge';
import Multiselect from 'multiselect-react-dropdown';
import {
	getAllChallenges,
	getChallengesSolved,
} from '../server/challengeFunctions';
import Filter from '../components/multiSelect';

export default function Challenges({ categories: challengeData, solvedIDs }) {
	const { data: session, status } = useSession();
	let catMap = {};
	for (const category of challengeData) {
		catMap[category.name] = true;
	}
	const [categoryFilter, setCategories] = useState(catMap);
	const [catPlaceholder, setCatPlaceholder] = useState(
		Object.keys(catMap).length + ' categories selected'
	);

	function catSelect(selectedList, selectedItem) {
		let filteredMap = { ...categoryFilter };
		filteredMap[selectedItem] = true;
		setCategories(filteredMap);
		const num = Object.values(filteredMap).filter((e) => e).length;
		setCatPlaceholder(num + ' categories selected');
		console.log(catPlaceholder);
	}

	function catRemove(selectedList, selectedItem) {
		let filteredMap = { ...categoryFilter };
		filteredMap[selectedItem] = false;
		setCategories(filteredMap);
		const num = Object.values(filteredMap).filter((e) => e).length;
		if (num === 0) setCatPlaceholder('Select Category');
		else setCatPlaceholder(num + ' categories selected');
	}

	if (session) {
		return (
			<>
				<h1>Challenges</h1>
				<br />
				<h4>Filters</h4>
				<Row>
					<Col>
						<Filter
							options={Object.keys(catMap)}
							onSelect={catSelect}
							onRemove={catRemove}
							placeholder={catPlaceholder}
						/>
					</Col>
					<Col></Col>
					<Col></Col>
					<Col></Col>
				</Row>
				<br />
				{challengeData.map((category) => {
					if (categoryFilter[category.name]) {
						return (
							<div key={category.name}>
								<h2>{category.name}</h2>
								<br />
								<Row>
									{category.challenges.map((challenge) => {
										return (
											<Challenge
												key={challenge.id}
												chal={challenge}
												solved={solvedIDs.includes(challenge.id)}
											/>
										);
									})}
								</Row>
								<br />
							</div>
						);
					}
				})}
			</>
		);
	} else {
		return <h1>Unauthorized</h1>;
	}
}

// Get challenges
export async function getServerSideProps(context) {
	const session = await getSession(context);
	if (!session) return { props: {} };
	const challengeData = await getAllChallenges();
	const userSolved = await getChallengesSolved(session.user.id);
	const solvedIDs = [];
	for (const solved of userSolved) {
		solvedIDs.push(solved.challengeId);
	}
	return {
		props: { categories: challengeData, solvedIDs },
	};
}
