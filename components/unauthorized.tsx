export default function Unauthorized() {
	return (
		<div className='txt-center h-100 align-items-center row'>
			<div>
				<h1>Unauthorized</h1>
				<h3>
					Please sign in <a href='/login'>here</a>
				</h3>
			</div>
		</div>
	);
}
