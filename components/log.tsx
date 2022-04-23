import { useState } from "react";
import { Modal } from "react-bootstrap";
import dayjs from 'dayjs';

export default function Log({ style, data }) {
    const [show, setShow] = useState(false);

    return <>
        <tr className={style} onClick={() => setShow(true)}>
            <td>{dayjs(data.added).format('DD MMM, HH:mm:ss')}</td>
            <td><code>{data.code}</code></td>
            <td>{data.message.substring(0, 60)}...</td>
            <td>{data.trace.substring(0, 60)}...</td>
        </tr>
        <Modal
            size="xl"
            show={show}
            onHide={() => setShow(false)}
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Error ID: {data.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <code>
                    {data.message}
                    <hr />
                    {data.trace}
                </code>
            </Modal.Body>
        </Modal>
    </>
}