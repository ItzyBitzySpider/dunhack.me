import React from 'react';
import Link from 'next/link';
import { Sidenav, Nav } from 'rsuite';

const SidebarNavigation = () => (
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

				<li>
					<Link href='login'>
						<a>Login</a>
					</Link>
				</li>
			</ul>
		</nav>
		<style jsx>{`
			.sidebar {
				background-color: #006989;
				width: 20%;
				height: 100vh;
				display: flex;
				// justify-content: center;
				align-items: center;
				float: left;
			}

			.nav-menu {
				position: relative;
				font-size: 20px;
				list-style: none;
			}

			a {
				color: #EAEBED;
				letter-spacing: 0.1em;
				margin-top: 20px;
				font-size: 1em;
				display: block;
				transition: all ease-out 300ms;
				text-decoration: none;
			}

			a:hover {
				color: white;
				font-weight: bold;
			}

			a:active{
				color: white;
				font-weight: bold;
			}

		`}</style>
	</div>
);

export default SidebarNavigation;
