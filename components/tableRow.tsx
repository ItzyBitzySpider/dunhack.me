import { Col, Row } from 'react-bootstrap';
import styles from '../styles/tableRow.module.scss';

export default function TableRow({
	left,
	middle,
	right,
	variant,
}: {
	left: String;
	middle: String;
	right: String;
	variant: String;
}) {
	return (
		<>
			{variant === 'header' && (
				<Row className={styles.header}>
					<Col className={styles.center} md={2}>{left}</Col>
					<Col md={6}>{middle}</Col>
					<Col className={styles.center} md={4}>
						{right}
					</Col>
				</Row>
			)}
			{variant === 'dark' && (
				<Row className={styles.even}>
					<Col className={styles.center} md={2}>{left}</Col>
					<Col md={6}>{middle}</Col>
					<Col className={styles.center} md={4}>
						{right}
					</Col>
				</Row>
			)}

			{variant === 'light' && (
				<Row className={styles.odd}>
					<Col className={styles.center} md={2}>{left}</Col>
					<Col md={6}>{middle}</Col>
					<Col className={styles.center} md={4}>
						{right}
					</Col>
				</Row>
			)}
		</>
	);
}
