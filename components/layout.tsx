import Head from 'next/head';
import SidebarNavigation from './sidebarNavigation';
import styles from '../styles/layout.module.scss';

export default function Layout({ children }) {
	return (
		<>
			<Head>
				<title>It'z Different CTF</title>
				<meta charSet='utf-8' />
				<meta name='viewport' content='initial-scale=1.0, width=device-width' />
				<link rel='shortcut icon' type='image/x-icon' href='favicon.ico' />
			</Head>
			<div className={styles.main}>
				<div className={styles.sidebar}>
					<SidebarNavigation />
				</div>
				<main className={styles.content}>{children}</main>
			</div>
		</>
	);
}
