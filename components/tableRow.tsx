import { Col, Row } from 'react-bootstrap';
import styles from '../styles/tableRow.module.scss';

export default function TableRow({
	left,
	middle,
	right,
	variant,
}: {
	left: string;
	middle: string;
	right: string;
	variant: string;
}) {
	return (
		<>
			{variant === 'header' && (
				<Row className={styles.header}>
					<Col className={styles.center} md={1}>
						{left}
					</Col>
					<Col md={1} />
					<Col md={5}>{middle}</Col>
					<Col md={2} />
					<Col className={styles.center} md={3}>
						{right}
					</Col>
				</Row>
			)}
			{variant === 'dark' && (
				<Row className={styles.even}>
					<Col className={styles.center} md={1}>
						{left}
					</Col>
					<Col md={1} />
					<Col md={5}>{middle}</Col>
					<Col md={2} />
					<Col className={styles.center} md={3}>
						{right}
					</Col>
				</Row>
			)}

			{variant === 'light' && (
				<Row className={styles.odd}>
					<Col className={styles.center} md={1}>
						{left}
					</Col>
					<Col md={1} />
					<Col md={5}>{middle}</Col>
					<Col md={2} />
					<Col className={styles.center} md={3}>
						{right}
					</Col>
				</Row>
			)}
		</>
	);
}
