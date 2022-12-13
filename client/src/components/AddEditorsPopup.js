import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useCookies } from "react-cookie";

function AddEditorsPopup(props) {
	const [show, setShow] = useState(false);
	const [email, setEmail] = useState("");
	const [emails, setEmails] = useState([]);
	const [cookies, setCookie] = useCookies(["token"]);
	const [message, setMessage] = useState("");

	const handleSubmit = () => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios
			.patch(
				`http://localhost:5000/addEditors/${props.journalId}`,
				{
					editors: emails,
				},
				config
			)
			.then((res) => {
				console.log(res.data);
				setMessage(res.data.message);
				setEmails([]);
				// setShow(false);
			});
	};
	const handleClose = () => {
		setShow(false);
		setEmails([]);
		setMessage("");
	};

	const handleShow = () => {
		setShow(true);
	};

	const onAdd = (e) => {
		e.preventDefault();
		setEmails([...emails, email]);
		setEmail("");
	};

	console.log(emails);
	return (
		<>
			<button className="add-members-btn" onClick={handleShow}>
				Add Members
			</button>
			<Modal className="edit-modal" show={show} onHide={handleClose}>
				{" "}
				<Modal.Header closeButton>
					<Modal.Title>Add Members</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<label>Enter Email Id(s)</label>
						<div>
							{emails.map((email) => {
								return <div className="entered-email">{email}</div>;
							})}
						</div>
						<input
							className="form-control"
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						></input>
						<button className="add-editor-btn" type="submit" onClick={onAdd}>
							Add
						</button>
					</form>
					{message !== "" && (
						<div
							className={"add-editor-response-msg"}
							style={
								message === "Editor list updated"
									? { color: "green" }
									: { color: "red" }
							}
						>
							{message === "Editor list updated" && <i class="fas fa-check" />}{" "}
							{message}
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSubmit}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

export default AddEditorsPopup;
