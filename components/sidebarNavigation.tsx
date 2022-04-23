import React, { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import styles from '../styles/sidebar.module.scss';
import { BsGrid } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { GoSignOut, GoSignIn } from 'react-icons/go';
import { BiHome, BiCrown } from 'react-icons/bi';
import { useRouter } from 'next/router';

export default function SidebarNavigation() {
	const { data: session, status } = useSession();
	const { asPath, pathname } = useRouter();
	const path = pathname.split('/');
	const [active, setActive] = useState(path[1]);
	return (
			<nav className={styles.sidebar}>
				<img className={styles.img} src='./Logo.png'/>
				<ul className={styles.nav}>
					<li>
						<Link href='/'>
							<a
								onClick={() => setActive('')}
								className={active === '' ? styles.selected : styles.text}>
								<BiHome size='24px' />
								&emsp; &emsp;Home
							</a>
						</Link>
					</li>

					<li>
						<Link href='/challenges'>
							<a
								onClick={() => setActive('challenges')}
								className={
									active === 'challenges' ? styles.selected : styles.text
								}>
								<BsGrid size='24px' /> &emsp; &emsp;Challenges
							</a>
						</Link>
					</li>

					<li>
						<Link href='/scoreboard'>
							<a
								onClick={() => setActive('scoreboard')}
								className={
									active === 'scoreboard' ? styles.selected : styles.text
								}>
								<BiCrown size='24px' /> &emsp; &emsp;Scoreboard
							</a>
						</Link>
					</li>
					{session && (
						<li>
							<Link href='/profile'>
								<a
									onClick={() => setActive('profile')}
									className={
										active === 'profile' || active === 'login'
											? styles.selected
											: styles.text
									}>
									<CgProfile size='24px' /> &emsp; &emsp;Profile
								</a>
							</Link>
						</li>
					)}
					{session && (
						<li>
							<a
								onClick={() => {
									setActive('signout');
									signOut({ callbackUrl: `${window.location.origin}` });
								}}
								className={
									active === 'signout' ? styles.selected : styles.text
								}>
								<GoSignOut size='24px' /> &emsp; &emsp;Sign Out
							</a>
						</li>
					)}
					{!session && (
						<li>
							<Link href='/login'>
								<a
									onClick={() => setActive('login')}
									className={
										active === 'login' ? styles.selected : styles.text
									}>
									<GoSignIn size='24px' /> &emsp; &emsp;Login
								</a>
							</Link>
						</li>
					)}
				</ul>
			</nav>
	);
}
