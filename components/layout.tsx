import SidebarNavigation from './sidebarNavigation';

export default function Layout({ children }) {
	return (
		<>
			<div className='vh-100'>
				<div className='row justify-content-center h-100 g-0'>
					<div className='col-md-3 col-sm-12'>
						<SidebarNavigation />
					</div>
					<main className='col-md-9 col-sm-12 align-self-center'>
						{children}
					</main>
				</div>
			</div>
		</>
	);
}
