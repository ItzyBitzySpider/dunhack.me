import React from 'react';
import Link from 'next/link';
import { Sidenav, Nav } from 'rsuite';

const NavLink = React.forwardRef((props, ref) => {
	const { as, href, ...rest } = props;
	return (
		<Link href={href} as={as}>
			<a ref={ref} {...rest} />
		</Link>
	);
});

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
				background-color: #2c5784;
				width: 250px;
				height: 100vh;
				padding: 0 0.5rem;
				display: flex;
				justify-content: center;
				align-items: center;
				float: left;
			}

			.nav-menu {
				font-size: 20px;
				list-style-type: none;
				margin: 0;
				padding: 0;
			}

			li {
				padding: 5px;
			}

			a {
				color: white;
			}

			a:hover {
				text-decoration: none;
				font-weight: bold;
			}
		`}</style>
	</div>
);

export default SidebarNavigation;
