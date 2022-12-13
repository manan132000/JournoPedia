import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../css/Login.css";
import { useCookies } from "react-cookie";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessageDisplay, setErrorMessageDisplay] = useState("none");
	const [spinnerVisible, setSpinnerVisible] = useState("hidden");
	const [cookies, setCookie] = useCookies(["token"]);
	let navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSpinnerVisible("visible");
		console.log(email, password);
		await axios
			.post(`http://localhost:5000/login`, {
				loginCred: email,
				password: password,
			})
			.then((res) => {
				console.log(res.data);
				setSpinnerVisible("hidden");
				if (res.data.token) {
					setCookie("token", res.data.token, { path: "/" });
					setErrorMessageDisplay("none");
					navigate("/home");
					window.location.reload();
				} else if (res.data.message) {
					setErrorMessageDisplay("block");
				} else {
					console.log(res.data);
				}
			});
	};

	return (
		<div className="login-div auth-inner">
			<form>
				<h3>Log In</h3>
				<div className="mb-3">
					<label>Email address</label>
					<input
						type="email"
						className="form-control"
						placeholder="Enter email"
						value={email}
						onChange={(e) => {
							setErrorMessageDisplay("none");
							setEmail(e.target.value);
						}}
					/>
				</div>
				<div className="mb-3">
					<label>Password</label>
					<input
						type="password"
						className="form-control"
						placeholder="Enter password"
						value={password}
						onChange={(e) => {
							setErrorMessageDisplay("none");
							setPassword(e.target.value);
						}}
					/>
				</div>
				<div className="d-grid">
					<button
						className="btn btn-primary login-btn"
						type="submit"
						onClick={handleSubmit}
					>
						Log In
						<span
							style={{ visibility: spinnerVisible }}
							className="spinner-border spinner-border-sm"
							role="status"
							aria-hidden="true"
						/>
					</button>
				</div>
				<div className="error-message" style={{ display: errorMessageDisplay }}>
					Invalid Login Credentials
				</div>
				<p className="forgot-password text-right">
					Forgot <Link to="/forget-password">password?</Link>
				</p>
			</form>
		</div>
	);
}
export default Login;
