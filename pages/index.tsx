import Head from 'next/head';
import React from 'react';
import styles from '../styles/home.module.scss';
import Image from 'next/image';
import { Col, Row } from 'react-bootstrap';

export default function Home() {
	return (
		<>
			<div className={styles.banner}><Image src='Logo.png'/></div>
			<br/>
			<h5 className='txt-center'>CTF Training Platform</h5>
			<h6 className='txt-center'>brought to you by ItzyBitzySpider</h6>
			<br/><br/>
			<h2 className='txt-center'>Frequent Asked Questions</h2>
			<br />
			<br />
			<h3>What is dunhack.me?</h3>
			<br />
			<p>
				dunhack.me is a CTF training platform. We host a collection of
				challenges from past CTFs held in Singapore. This CTF will run
				indefinitely.
			</p>
			<br />
			<br />
			<h3>How does it work?</h3>
			<br />
			<p>
				If you are unfamiliar with CTFs, you may take a look at this{' '}
				<a href='https://www.youtube.com/watch?v=8ev9ZX9J45A'>video</a> and this{' '}
				<a href='https://trailofbits.github.io/ctf/'>guide</a> to find out more.
			</p>
			<br />
			<br />
			<h3>List of CTFs collated</h3>
			<ul>
				<li>None</li>
			</ul>
			<br />
			<br />
			<h2 className='txt-center'>Sponsors</h2>
			<Row className='justify-content-center pt-5'>
				<Row className={styles.sponsorBox}>
					<Col><img/></Col>
					<Col><img/></Col>
					<Col><img/></Col>
				</Row>
			</Row>
			<br />
			<br />
		</>
	);
}
