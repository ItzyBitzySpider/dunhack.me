import Head from 'next/head';
import SidebarNavigation from '../components/sidebarNavigation';
import React from 'react';
import Link from "next/link"
import {signIn, signOut, useSession} from 'next-auth/react'

export default function Home() {
    const {data: session, status} = useSession();
	return (
		<>
			<SidebarNavigation />
			<h1>Home page under construction</h1>
            {!session && <h1>please log in</h1>}
            {session && <h1>logged in</h1>}
		</>
	);
}
