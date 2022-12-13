import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import Popup from "reactjs-popup";
import "../css/EditInfoPopup.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useCookies } from "react-cookie";
import MultiSelect from "react-multiple-select-dropdown-lite";
import { expertise } from "../utils/expertise.js";
import { PuffLoader } from "react-spinners";
import axios from "axios";
import { countries } from "../utils/countries";
import Dropdown from "react-dropdown";

function EditInfoPopup() {
	const [show, setShow] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [institute, setInstitute] = useState("");
	const [designation, setDesignation] = useState("");
	const [country, setCountry] = useState("");
	const [topics, setTopics] = useState([]);
	const [spinnerVisible, setSpinnerVisible] = useState("visible");
	const [cookies, setCookie] = useCookies(["token"]);
	const [changePass, setChangePass] = useState(false);
	const navigate = useNavigate();

	const handleClose = () => {
		setShow(false);
		setChangePass(false);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const config = {
			headers: {
				"Content-Type": "application/json",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		if (changePass) {
			axios
				.patch(
					`http://localhost:5000/changePassword`,
					{
						oldPassword: currentPassword,
						newPassword: newPassword,
					},
					config
				)
				.then((res) => {
					navigate("/logout");
					console.log(res.data.message);
				});
		} else {
			axios
				.patch(
					`http://localhost:5000/editUserDetails`,
					{
						name: name,
						phone: phone,
						expertise: topics,
						designation: designation,
						institute: institute,
						country: country,
					},
					config
				)
				.then((res) => {
					console.log(res.data.message);
				});
		}
		setShow(false);
		setChangePass(false);
	};
	const handleShow = () => {
		setShow(true);
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios.get(`http://localhost:5000/userDetailsToken`, config).then((res) => {
			console.log(res.data);
			setName(res.data.name);
			setPhone(res.data.phone);
			setTopics(res.data.expertise);
			setDesignation(res.data.designation);
			setInstitute(res.data.institute);
			setCountry(res.data.country);
			setSpinnerVisible("hidden");
		});
	};

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

	const changePassword = () => {
		setChangePass(true);
	};

	return (
		<div>
			<div className="edit-info-div" onClick={handleShow}>
				<i class="fas fa-pen"></i> Edit Info
			</div>
			<Modal className="edit-modal" show={show} onHide={handleClose}>
				{spinnerVisible === "visible" && (
					<div className="loading-div loading-edit-div">
						<PuffLoader
							cssOverride={{ display: "inline-block" }}
							loading={true}
							size={40}
							aria-label="Loading Spinner"
							data-testid="loader"
						/>{" "}
						<span className="loading">Loading</span>
					</div>
				)}
				{spinnerVisible === "hidden" && (
					<>
						{" "}
						<Modal.Header closeButton>
							<Modal.Title>Edit Information</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<form>
								{changePass && (
									<>
										<div className="mb-3">
											<label>Current Password</label>
											<input
												type="password"
												className="form-control"
												placeholder="Current password"
												value={currentPassword}
												onChange={(e) => {
													setCurrentPassword(e.target.value);
												}}
											/>
										</div>
										<div className="mb-3">
											<label>New Password</label>
											<input
												type="password"
												className="form-control"
												placeholder="New password"
												value={newPassword}
												onChange={(e) => {
													setNewPassword(e.target.value);
												}}
											/>
										</div>
									</>
								)}
								{!changePass && (
									<>
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
											<label>Phone No</label>
											<input
												type="number"
												className="form-control"
												placeholder="Phone No"
												value={phone}
												onChange={(e) => {
													setPhone(e.target.value);
												}}
											/>
										</div>
										<div className="mb-3">
											<label>Expertise</label>
											<MultiSelect
												defaultValue={topics}
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
												value={country}
												placeholder="Select an option"
											/>
										</div>
									</>
								)}
							</form>
							{!changePass && (
								<div className="change-pass-div" onClick={changePassword}>
									Change password
								</div>
							)}
							{changePass && (
								<div
									className="change-pass-div"
									onClick={() => {
										setChangePass(false);
									}}
								>
									Back
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
					</>
				)}
			</Modal>
		</div>
	);
}

export default EditInfoPopup;
