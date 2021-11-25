import SidebarNavigation from './sidebarNavigation';

export default function Layout({ children }) {
	return (
		<>
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
