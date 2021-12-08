import React, { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import styles from '../styles/sidebar.module.scss';

export default function SidebarNavigation() {
	const { data: session, status } = useSession();
	const [active, setActive] = useState(0);
	return (
		<>
			<nav className={styles.sidebar}>
				<ul className={styles.nav}>
					<li>
						<Link href='/'>
							<a
								onClick={() => setActive(0)}
								className={active === 0 ? styles.selected : styles.text}>
								Home
							</a>
						</Link>
					</li>

					<li>
						<Link href='/challenges'>
							<a
								onClick={() => setActive(1)}
								className={active === 1 ? styles.selected : styles.text}>
								Challenges
							</a>
						</Link>
					</li>

					<li>
						<Link href='/scoreboard'>
							<a
								onClick={() => setActive(2)}
								className={active === 2 ? styles.selected : styles.text}>
								Scoreboard
							</a>
						</Link>
					</li>
					{session && (
						<li>
							<Link href='/profile'>
								<a
									onClick={() => setActive(3)}
									className={active === 3 ? styles.selected : styles.text}>
									Profile
								</a>
							</Link>
						</li>
					)}
					{session && (
						<li>
							<a
								onClick={() =>
									signOut({ callbackUrl: `${window.location.origin}` })
								}
								className={styles.text}>
								Sign Out
							</a>
						</li>
					)}
					{!session && (
						<li>
							<Link href='/login'>
								<a
									onClick={() => setActive(4)}
									className={active === 4 ? styles.selected : styles.text}>
									Login
								</a>
							</Link>
						</li>
					)}
				</ul>
			</nav>
		</>
	);
}
