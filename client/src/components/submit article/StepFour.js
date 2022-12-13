import React, { useEffect, useState } from "react";
import { countries } from "../../utils/countries";
import Dropdown from "react-dropdown";

function StepFour(props) {
	const [inputValues, setInputValues] = [];
	const [counter, setCounter] = useState(0);
	const [names, setNames] = useState(["", "", "", ""]);
	const [emails, setEmails] = useState(["", "", "", ""]);
	const [phones, setPhones] = useState(["", "", "", ""]);
	const [countryValues, setCountryValues] = useState(["", "", "", ""]);
	const [numAuthors, setNumAuthors] = useState(0);

	useEffect(() => {
		const authors = [];
		for (var i = 0; i < numAuthors; i++) {
			const obj = {
				name: names[i],
				email: emails[i],
				phone: phones[i],
				countryValues: countryValues[i],
			};
			authors.push(obj);
		}
		props.setAuthors(authors);
	}, [names, emails, phones, countryValues]);

	const handleOnChange = (e) => {
		const abc = {};
		abc[e.target.className] = e.target.value;
		setInputValues({ ...inputValues, ...abc });
	};

	const handleClick = (e) => {
		e.preventDefault();
		setCounter(counter + 1);
		setNumAuthors(numAuthors + 1);
	};
	return (
		<>
			<div className="auth-inner mb-3">
				<button
					className="btn btn-primary add-author-btn"
					onClick={handleClick}
				>
					Add New Author
				</button>

				{Array.from(Array(counter)).map((c, index) => {
					return (
						<div className="reviewer-div">
							<label className="reviewer-heading">Author {index + 1}</label>
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
					);
				})}
			</div>
			<button
				type="submit"
				className="btn btn-primary final-submit-btn"
				onClick={props.handleSubmit}
			>
				Submit
			</button>
		</>
	);
}

export default StepFour;
