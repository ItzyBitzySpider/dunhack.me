import Link from "next/link"
export default function Unauthorized() {
	return (
		<div className='txt-center h-100 align-items-center row'>
			<div>
				<h1>Unauthorized</h1>
				<h3>
					Please sign in <Link href='/login'>here</Link>
				</h3>
			</div>
		</div>
	);
}
