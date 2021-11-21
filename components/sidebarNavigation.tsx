import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function SidebarNavigation() {
	const { data: session, status } = useSession();
	return (
		<>
			<div className='sidebar'>
				<nav>
					<ul className='nav-menu'>
						<li>
							<Link href='/'>
								<a>Home</a>
							</Link>
						</li>

						<li>
							<Link href='challenges'>
								<a>Challenges</a>
							</Link>
						</li>

						<li>
							<Link href='scoreboard'>
								<a>Scoreboard</a>
							</Link>
						</li>
						{session && (
							<li>
								<Link href='profile'>
									<a>Profile</a>
								</Link>
							</li>
						)}
						{!session && (
							<li>
								<Link href='login'>
									<a>Login</a>
								</Link>
							</li>
						)}
					</ul>
				</nav>
				<style jsx>{`
					.sidebar {
						background-color: #14213d;
						width: 20%;
						height: 100vh;
						display: flex;
						align-items: center;
						float: left;
					}

					.nav-menu {
						position: relative;
						font-size: 20px;
						list-style: none;
					}

					a {
						color: #ffda33aa;
						letter-spacing: 0.1em;
						margin-top: 20px;
						font-size: 1em;
						display: block;
						transition: all ease-out 300ms;
						text-decoration: none;
					}

					a:hover {
						color: #ffda33;
						font-weight: bold;
					}

					a:active {
						color: white;
						font-weight: bold;
					}
				`}</style>
			</div>
		</>
	);
}
