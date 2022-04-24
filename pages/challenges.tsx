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
import { assert } from 'console';
import Unauthorized from '../components/unauthorized';

export default function Challenges({ challengeData, solvedIDs }) {
	const { data: session, status } = useSession();

	// category filter
	let catMap = {};
	for (const category of challengeData) catMap[category.name] = true;
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
	}

	function catRemove(selectedList, selectedItem) {
		let filteredMap = { ...categoryFilter };
		filteredMap[selectedItem] = false;
		setCategories(filteredMap);
		const num = Object.values(filteredMap).filter((e) => e).length;
		if (num === 0) setCatPlaceholder('Select Category');
		else setCatPlaceholder(num + ' categories selected');
	}

	// ctf filter
	let ctfMap = {};
	for (const category of challengeData) {
		for (const chall of category.challenges) {
			ctfMap[chall.ctfName.name] = true;
		}
	}
	const [ctfFilter, setCTF] = useState(ctfMap);
	const [ctfPlaceholder, setCTFPlaceholder] = useState(
		Object.keys(ctfMap).length + ' CTFs selected'
	);

	function ctfSelect(selectedList, selectedItem) {
		let filteredMap = { ...ctfFilter };
		filteredMap[selectedItem] = true;
		setCTF(filteredMap);
		const num = Object.values(filteredMap).filter((e) => e).length;
		setCTFPlaceholder(num + ' CTFs selected');
	}

	function ctfRemove(selectedList, selectedItem) {
		let filteredMap = { ...ctfFilter };
		filteredMap[selectedItem] = false;
		setCTF(filteredMap);
		const num = Object.values(filteredMap).filter((e) => e).length;
		if (num === 0) setCTFPlaceholder('Select CTF');
		else setCTFPlaceholder(num + ' CTFs selected');
	}

	if (session) {
		return (
			<>
				<h1 className='txt-center'>Challenges</h1>
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
					<Col>
						<Filter
							options={Object.keys(ctfMap)}
							onSelect={ctfSelect}
							onRemove={ctfRemove}
							placeholder={ctfPlaceholder}
						/>
					</Col>
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
										if (ctfFilter[challenge.ctfName.name]) {
											return (
												<Challenge
													key={challenge.id}
													chal={challenge}
													solved={solvedIDs.includes(challenge.id)}
												/>
											);
										}
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
		return <Unauthorized />;
	}
}

// Get challenges
export async function getServerSideProps(context) {
	const session = await getSession(context);
	if (!session) return { props: { challengeData: [], solvedIDs: [] } };
	const challengeData = await getAllChallenges();
	const userSolved = await getChallengesSolved(session.user.id);
	console.log(userSolved);
	const solvedIDs = [];
	if (userSolved) {
		for (const solved of userSolved) {
			solvedIDs.push(solved.challengeId);
		}
	}
	return {
		props: { challengeData, solvedIDs },
	};
}
