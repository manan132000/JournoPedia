import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import MultiSelect from "react-multiple-select-dropdown-lite";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { countries } from "../utils/countries";
import { expertise } from "../utils/expertise";

function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [emailExists, setEmailExists] = useState(false);
	const [phoneExists, setPhoneExists] = useState(false);
	const [institute, setInstitute] = useState("");
	const [country, setCountry] = useState("");
	const [designation, setDesignation] = useState("");
	const [topics, setTopics] = useState([]);
	const [spinnerVisible, setSpinnerVisible] = useState("hidden");
	const [cookies, setCookie] = useCookies(["token"]);

	let navigate = useNavigate();

	const handleOnTopicChange = (topics) => {
		let str = "";
		let topicsArr = [];
		for (let c of topics) {
			if (c === ",") {
				topicsArr.push(str);
				str = "";
			} else {
				str += c;
			}
		}
		topicsArr.push(str);
		setTopics(topicsArr);
		console.log(topicsArr);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSpinnerVisible("visible");
		console.log(email, password, topics, country);
		setEmailExists(false);
		setPhoneExists(false);
		await axios
			.post(`http://localhost:5000/signup`, {
				name: name,
				email: email,
				phone: phone,
				password: password,
				institute: institute,
				country: country,
				expertise: topics,
				designation: designation,
			})
			.then((res) => {
				setSpinnerVisible("hidden");
				console.log(res.data);
				if (res.data.token) {
					setCookie("token", res.data.token, { path: "/" });
					setEmailExists(false);
					setPhoneExists(false);
					navigate("/home");
				} else if (res.data.message === "Email already registered") {
					setEmailExists(true);
				} else if (res.data.message === "Phone already registered") {
					setPhoneExists(true);
				} else {
					console.log(res.data);
				}
			});
	};

	return (
		<div className="auth-inner signup-div">
			<form>
				<h3>Sign Up</h3>
				<div className="mb-3">
					<label>Name</label>
					<input
						type="text"
						className="form-control"
						placeholder="Name"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
						}}
					/>
				</div>
				<div className="mb-3">
					<label>Email address</label>
					<input
						type="email"
						className="form-control"
						placeholder="Enter email"
						value={email}
						onChange={(e) => {
							setEmailExists(false);
							setPhoneExists(false);
							setEmail(e.target.value);
						}}
					/>
				</div>
				<div className="mb-3">
					<label>Phone No</label>
					<input
						type="number"
						className="form-control"
						placeholder="Phone No"
						value={phone}
						onChange={(e) => {
							setEmailExists(false);
							setPhoneExists(false);
							setPhone(e.target.value);
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
							setPassword(e.target.value);
						}}
					/>
				</div>
				<div className="mb-3">
					<label>Expertise</label>
					<MultiSelect
						width={"100%"}
						onChange={handleOnTopicChange}
						options={expertise}
					/>
				</div>
				<div className="mb-3">
					<label>Designation</label>
					<input
						type="text"
						className="form-control"
						placeholder="Designation"
						value={designation}
						onChange={(e) => {
							setEmailExists(false);
							setPhoneExists(false);
							setDesignation(e.target.value);
						}}
					/>
				</div>
				<div className="mb-3">
					<label>Institute</label>
					<input
						type="text"
						className="form-control"
						placeholder="Institute"
						value={institute}
						onChange={(e) => {
							setEmailExists(false);
							setPhoneExists(false);
							setInstitute(e.target.value);
						}}
					/>
				</div>
				<div className="mb-3">
					<label>Country</label>
					<Dropdown
						options={countries}
						onChange={(e) => {
							setCountry(e.label);
						}}
						// value={defaultOption}
						placeholder="Select an option"
					/>
				</div>
				<div className="d-grid">
					<button
						className="btn btn-primary login-btn"
						type="submit"
						onClick={handleSubmit}
					>
						Sign Up
						<span
							style={{ visibility: spinnerVisible }}
							className="spinner-border spinner-border-sm"
							role="status"
							aria-hidden="true"
						/>
					</button>
				</div>
				<div className="error-message">
					{emailExists
						? "Email already exists"
						: phoneExists
						? "Phone No already exists"
						: ""}
				</div>
				<p className="forgot-password text-right">
					Already registered <a href="/sign-in">sign in?</a>
				</p>
			</form>
		</div>
	);
}

export default SignUp;
