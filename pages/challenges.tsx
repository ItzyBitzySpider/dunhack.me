import { authOptions } from "./api/auth/[...nextauth]"
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Challenge from '../components/challenge';
import Multiselect from 'multiselect-react-dropdown';
import {
  getAllChallenges,
  getChallengesSolved,
} from '../server/challengeFunctions';
import Filter from '../components/multiSelect';
import Unauthorized from '../components/unauthorized';
import { unstable_getServerSession } from 'next-auth';

export default function Challenges({
  challengeData,
  solvedIDs,
  activeInstances,
}) {
  const { data: session, status } = useSession();

  // category filter
  let categoryMap = {};
  for (const category of challengeData) categoryMap[category.name] = true;
  const [categoryFilter, setCategories] = useState(categoryMap);
  const [categoryPlaceholder, setCategoryPlaceholder] = useState(
    Object.keys(categoryMap).length + ' categories selected'
  );

  const categorySelect = (_, selectedItem) => {
    let filteredMap = { ...categoryFilter };
    filteredMap[selectedItem] = true;
    setCategories(filteredMap);
    const num = Object.values(filteredMap).filter((e) => e).length;
    setCategoryPlaceholder(num + ' categories selected');
  };

  const categoryRemove = (_, selectedItem) => {
    let filteredMap = { ...categoryFilter };
    filteredMap[selectedItem] = false;
    setCategories(filteredMap);
    const num = Object.values(filteredMap).filter((e) => e).length;
    if (num === 0) setCategoryPlaceholder('Select Category');
    else setCategoryPlaceholder(num + ' categories selected');
  };

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

  const ctfSelect = (_, selectedItem) => {
    let filteredMap = { ...ctfFilter };
    filteredMap[selectedItem] = true;
    setCTF(filteredMap);
    const num = Object.values(filteredMap).filter((e) => e).length;
    setCTFPlaceholder(num + ' CTFs selected');
  };

  const ctfRemove = (_, selectedItem) => {
    let filteredMap = { ...ctfFilter };
    filteredMap[selectedItem] = false;
    setCTF(filteredMap);
    const num = Object.values(filteredMap).filter((e) => e).length;
    if (num === 0) setCTFPlaceholder('Select CTF');
    else setCTFPlaceholder(num + ' CTFs selected');
  };

  if (session) {
    return (
      <>
	<br />
	<h1 className='txt-center'>Challenges</h1>
	<h4>Filters</h4>
	<Row>
	  <Col>
	    <Filter
	      options={Object.keys(categoryMap)}
	      onSelect={categorySelect}
	      onRemove={categoryRemove}
	      placeholder={categoryPlaceholder}
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
			  key={challenge.title}
			  chal={challenge}
			  solved={solvedIDs.includes(challenge.id)}
			  activeInstance={activeInstances.find((instance) => {
			    // supports multiple running instances 
			    return instance.Challenge_Id === challenge.hash;
			  })
			  }
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
  const session = await unstable_getServerSession(context.req, context.res, authOptions);
  if (!session) return { props: { challengeData: [], solvedIDs: [] } };
  const challengeData = await getAllChallenges();
  const userSolved = await getChallengesSolved(session.user.id);
  const solvedIDs = [];
  if (userSolved) {
    for (const solved of userSolved) {
solvedIDs.push(solved.challengeId);
    }
  }
  const response = await fetch(
    `${process.env.RUNNER_SITE}/getUserStatus?userid=${session.user.id}`,
    {
      method: 'GET',
      headers: {
	Accept: 'application/json',
      },
    }
  );
  let activeInstances = [];
  let res = await response.json();
  if (response.status === 200) {
    // in the event we support multiple instances per user
    // for(instance in res){
    // 	// activeInstances.push();
    // }
    if(res.Running_Instance) activeInstances.push(res);
    console.log(res);
  }
  return {
    props: { challengeData, solvedIDs, activeInstances },
  };
}
