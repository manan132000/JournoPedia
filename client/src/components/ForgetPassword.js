import e from "cors";
import React, { useState } from "react";
import axios from "axios";

function ForgetPassword() {
	const [email, setEmail] = useState("");
	const [spinnerVisible, setSpinnerVisible] = useState("hidden");
	const [message, setMessage] = useState("");
	const [messageDisplay, setMessageDisplay] = useState("none");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSpinnerVisible("visible");
		await axios
			.post(`http://localhost:5000/forgetPassword`, {
				email: email,
			})
			.then((res) => {
				console.log(res.data);
				setSpinnerVisible("hidden");
				setMessageDisplay("block");
				setMessage(res.data);
			});
	};
	return (
		<div className="login-div auth-inner">
			<form>
				<h3>Send Password on Email</h3>
				<div className="mb-3 forgot-password-field">
					<label>Email address</label>
					<input
						type="email"
						className="form-control"
						placeholder="Enter email"
						value={email}
						onChange={(e) => {
							// setErrorMessageDisplay("none");
							setEmail(e.target.value);
						}}
					/>
				</div>
				<div className="d-grid">
					<button
						className="btn btn-primary login-btn"
						type="submit"
						onClick={handleSubmit}
					>
						Submit
						<span
							style={{ visibility: spinnerVisible }}
							className="spinner-border spinner-border-sm"
							role="status"
							aria-hidden="true"
						/>
					</button>
				</div>
				<div
					className="password-sent-message"
					style={{ display: messageDisplay }}
				>
					{message}
				</div>
			</form>
		</div>
	);
}

export default ForgetPassword;
