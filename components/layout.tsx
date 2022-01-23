import Head from 'next/head';
import SidebarNavigation from './sidebarNavigation';

export default function Layout({ children }) {
	return (
		<>
			<Head>
				<title>dunhack.me</title>
				<meta charSet='utf-8' />
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
			</Head>
			<div className='vh-100'>
				<div className='row justify-content-center h-100 g-0'>
					<div className='col-lg-2 col-md-12 col-sm-12'>
						<SidebarNavigation />
					</div>
					<main className='col-lg-10 col-md-12 col-sm-12 h-100 p-5'>
						{children}
					</main>
				</div>
			</div>
		</>
	);
}
