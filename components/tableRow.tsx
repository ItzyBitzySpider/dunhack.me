import { Col, Row } from 'react-bootstrap';
import styles from '../styles/tableRow.module.scss';

export default function TableRow({
	left,
	middle,
	right,
	variant,
}: {
	left: string;
	middle: any;
	right: string;
	variant?: string;
}) {
	return (
		<>
			{variant === 'header' && (
				<Row className={styles.header}>
					<Col className='txt-center' md={1}>
						{left}
					</Col>
					<Col md={7}>{middle}</Col>
					<Col className='txt-right' md={4}>
						{right}
					</Col>
				</Row>
			)}
			
			{variant !== 'header' && (
				<Row className={styles.row}>
					<Col className='txt-center' md={1}>
						{left}
					</Col>
					<Col md={7}>{middle}</Col>
					<Col className='txt-right' md={4}>
						{right}
					</Col>
				</Row>
			)}
		</>
	);
}
