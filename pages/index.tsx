import Head from 'next/head';
import React from 'react';

export default function Home() {
	return (
		<>
			<h1>Home</h1>
			<br/><br/>
			<h2>What is insert &lt;some name here&gt;? </h2>
			<a>
				It'z Different CTF is a CTF training platform. We host a collection of
				challenges from past CTFs held in Singapore. This CTF will run
				indefinitely.
			</a>
			<br/><br/><br/>
			<h2>How does it work?</h2>
			<a>If you are unfamiliar with CTFs, you may take a look at this </a>
			<a href='https://www.youtube.com/watch?v=8ev9ZX9J45A'>video</a>
			<a> and this </a>
			<a href='https://trailofbits.github.io/ctf/'>guide</a>
			<a> to find out more.</a>
			<br/><br/><br/>
			<h2>List of CTFs collated</h2>
			<ul>
				<li>None</li>
			</ul><br/>
			<h2>Sponsors</h2>
			<a>River's Big CTF Prize Stash</a>
			<br/><br/>
		</>
	);
}
