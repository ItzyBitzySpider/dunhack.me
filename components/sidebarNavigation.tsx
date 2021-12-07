import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import styles from '../styles/sidebar.module.scss';

export default function SidebarNavigation() {
	const { data: session, status } = useSession();
	return (
		<>
			<nav className={styles.sidebar}>
				<ul className={styles.nav}>
					<li>
						<Link href='/'>
							<a className={styles.text}>Home</a>
						</Link>
					</li>

					<li>
						<Link href='/challenges'>
							<a className={styles.text}>Challenges</a>
						</Link>
					</li>

					<li>
						<Link href='/scoreboard'>
							<a className={styles.text}>Scoreboard</a>
						</Link>
					</li>
					{session && (
						<li>
							<Link href='/profile'>
								<a className={styles.text}>Profile</a>
							</Link>
						</li>
					)}
					{session && (
						<li>
							<a onClick={() => signOut({ callbackUrl: `${window.location.origin}`})} className={styles.text}>Sign Out</a>
						</li>
					)}
					{!session && (
						<li>
							<Link href='/login'>
								<a className={styles.text}>Login</a>
							</Link>
						</li>
					)}
				</ul>
			</nav>
		</>
	);
}
