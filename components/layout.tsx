import SidebarNavigation from './sidebarNavigation';

export default function Layout({ children }) {
	return (
		<>
			<SidebarNavigation />
			<main>{children}</main>
		</>
	);
}
