import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { countries } from "../../utils/countries";
import Dropdown from "react-dropdown";
import "../../css/StepThree.css";

function StepThree(props) {
	const [inputValues, setInputValues] = useState([]);
	const [reviewer, setReviewer] = useState([]);
	const [cookies, setCookie] = useCookies(["token"]);
	const [names, setNames] = useState(["", "", "", ""]);
	const [emails, setEmails] = useState(["", "", "", ""]);
	const [phones, setPhones] = useState(["", "", "", ""]);
	const [countryValues, setCountryValues] = useState(["", "", "", ""]);

	useEffect(() => {
		const peerChoice = [];
		for (var i = 0; i < 4; i++) {
			const obj = {
				name: names[i],
				email: emails[i],
				phone: phones[i],
				countryValues: countryValues[i],
			};
			peerChoice.push(obj);
		}
		props.setPeerChoice(peerChoice);
	}, [names, emails, phones, countryValues]);

	console.log(names, phones, emails, countryValues);
	return (
		<div className="auth-inner mb-3 add-reviewer-form">
			{/**************************************** Reviewer - 1******************8****************************/}
			<div className="reviewer-div">
				<label className="reviewer-heading">Reviewer 1</label>
				<input
					type="text"
					// name="reviewer1"
					placeholder="Name"
					className="form-control reviewer-input reviewer-name"
					autoComplete="off"
					value={names[0]}
					onChange={(e) => {
						setNames(
							names.map((name, i) => {
								if (i == 0) return e.target.value;
								else return name;
							})
						);
					}}
				/>
				<input
					type="email"
					// name="reviewer1"
					placeholder="Email"
					className="form-control reviewer-input"
					autoComplete="off"
					value={emails[0]}
					onChange={(e) => {
						setEmails(
							emails.map((email, i) => {
								if (i == 0) return e.target.value;
								else return email;
							})
						);
					}}
				/>
				<input
					type="number"
					// name="reviewer1"
					placeholder="Phone No"
					className="form-control reviewer-input"
					autoComplete="off"
					value={phones[0]}
					onChange={(e) => {
						setPhones(
							phones.map((phone, i) => {
								if (i == 0) return e.target.value;
								else return phone;
							})
						);
					}}
				/>
				<Dropdown
					options={countries}
					onChange={(e) => {
						setCountryValues(
							countryValues.map((country, i) => {
								if (i == 0) return e.label;
								else return country;
							})
						);
					}}
					// value={defaultOption}
					placeholder="Select Country"
				/>
			</div>

			{/**************************************** Reviewer - 2******************8****************************/}
			<div className="reviewer-div">
				<label className="reviewer-heading">Reviewer 2</label>
				<input
					type="text"
					// name="reviewer1"
					placeholder="Name"
					className="form-control reviewer-input reviewer-name"
					autoComplete="off"
					value={names[1]}
					onChange={(e) => {
						setNames(
							names.map((name, i) => {
								if (i == 1) return e.target.value;
								else return name;
							})
						);
					}}
				/>
				<input
					type="email"
					// name="reviewer1"
					placeholder="Email"
					className="form-control reviewer-input"
					autoComplete="off"
					value={emails[1]}
					onChange={(e) => {
						setEmails(
							emails.map((email, i) => {
								if (i == 1) return e.target.value;
								else return email;
							})
						);
					}}
				/>
				<input
					type="number"
					// name="reviewer1"
					placeholder="Phone No"
					className="form-control reviewer-input"
					autoComplete="off"
					value={phones[1]}
					onChange={(e) => {
						setPhones(
							phones.map((phone, i) => {
								if (i == 1) return e.target.value;
								else return phone;
							})
						);
					}}
				/>
				<Dropdown
					options={countries}
					onChange={(e) => {
						setCountryValues(
							countryValues.map((country, i) => {
								if (i == 1) return e.label;
								else return country;
							})
						);
					}}
					// value={defaultOption}
					placeholder="Select Country"
				/>
			</div>

			{/**************************************** Reviewer - 3******************8****************************/}
			<div className="reviewer-div">
				<label className="reviewer-heading">Reviewer 3</label>
				<input
					type="text"
					// name="reviewer1"
					placeholder="Name"
					className="form-control reviewer-input reviewer-name"
					autoComplete="off"
					value={names[2]}
					onChange={(e) => {
						setNames(
							names.map((name, i) => {
								if (i == 2) return e.target.value;
								else return name;
							})
						);
					}}
				/>
				<input
					type="email"
					// name="reviewer1"
					placeholder="Email"
					className="form-control reviewer-input"
					autoComplete="off"
					value={emails[2]}
					onChange={(e) => {
						setEmails(
							emails.map((email, i) => {
								if (i == 2) return e.target.value;
								else return email;
							})
						);
					}}
				/>
				<input
					type="number"
					// name="reviewer1"
					placeholder="Phone No"
					className="form-control reviewer-input"
					autoComplete="off"
					value={phones[2]}
					onChange={(e) => {
						setPhones(
							phones.map((phone, i) => {
								if (i == 2) return e.target.value;
								else return phone;
							})
						);
					}}
				/>
				<Dropdown
					options={countries}
					onChange={(e) => {
						setCountryValues(
							countryValues.map((country, i) => {
								if (i == 2) return e.label;
								else return country;
							})
						);
					}}
					// value={defaultOption}
					placeholder="Select Country"
				/>
			</div>

			{/**************************************** Reviewer - 4******************8****************************/}
			<div className="reviewer-div">
				<label className="reviewer-heading">Reviewer 4</label>
				<input
					type="text"
					// name="reviewer1"
					placeholder="Name"
					className="form-control reviewer-input reviewer-name"
					autoComplete="off"
					value={names[3]}
					onChange={(e) => {
						setNames(
							names.map((name, i) => {
								if (i == 3) return e.target.value;
								else return name;
							})
						);
					}}
				/>
				<input
					type="email"
					// name="reviewer1"
					placeholder="Email"
					className="form-control reviewer-input"
					autoComplete="off"
					value={emails[3]}
					onChange={(e) => {
						setEmails(
							emails.map((email, i) => {
								if (i == 3) return e.target.value;
								else return email;
							})
						);
					}}
				/>
				<input
					type="number"
					// name="reviewer1"
					placeholder="Phone No"
					className="form-control reviewer-input"
					autoComplete="off"
					value={phones[3]}
					onChange={(e) => {
						setPhones(
							phones.map((phone, i) => {
								if (i == 3) return e.target.value;
								else return phone;
							})
						);
					}}
				/>
				<Dropdown
					options={countries}
					onChange={(e) => {
						setCountryValues(
							countryValues.map((country, i) => {
								if (i == 3) return e.label;
								else return country;
							})
						);
					}}
					// value={defaultOption}
					placeholder="Select Country"
				/>
			</div>
		</div>
	);
}

export default StepThree;
