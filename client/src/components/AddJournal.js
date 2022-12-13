import React, { useEffect, useState } from "react";
// import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import "../css/AddJournal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useCookies } from "react-cookie";

function AddJournal(props) {
	useEffect(() => {
		props.setDisplayItems(["none", "none", "inline", "inline", "inline"]);
	}, []);

	const [journalName, setJournalName] = useState("");
	const [synopsis, setSynopsis] = useState("");
	const [image, setImage] = useState();
	const [message, setMessage] = useState("");
	const [messageDisplay, setMessageDisplay] = useState("none");
	const [messageColor, setMessageColor] = useState("");
	const [spinnerVisible, setSpinnerVisible] = useState("hidden");
	const [cookies, setCookie] = useCookies(["token"]);
	// const [volumes, setVolumes] = useState();
	let navigate = useNavigate();

	useEffect(() => {
		props.setDisplayItems(["none", "none", "inline"]);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log(typeof volumes);
		setSpinnerVisible("visible");
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		await axios
			.post(
				`http://localhost:5000/createJournal`,
				{
					journal_name: journalName,
					synopsis: synopsis,
					image: image,
					//   topics_covered: topics,
				},
				config
			)
			.then((res) => {
				// console.log(res.data);
				setSpinnerVisible("hidden");
				setMessage(res.data.message);
				setMessageDisplay("inline");
				if (res.data.message === "Journal created successfully") {
					setMessageColor("green");
					navigate("/");
				} else setMessageColor("red");
			});
	};

	return (
		<div className="auth-inner add-journal-div">
			<form>
				<h3>Publish</h3>
				<div className="mb-3">
					<label>Journal Name</label>
					<input
						type="text"
						className="form-control"
						value={journalName}
						name="journal_name"
						autoComplete="off"
						onChange={(e) => {
							setMessageDisplay("none");
							setJournalName(e.target.value);
						}}
					/>
				</div>

				<div className="mb-3">
					<label>Synopsis</label>
					<textarea
						type="text"
						className="form-control"
						value={synopsis}
						name="synopsis"
						onChange={(e) => {
							setMessageDisplay("none");
							setSynopsis(e.target.value);
						}}
					/>
				</div>

				<div className="mb-3">
					<label>Upload Image</label>
					<input
						type="file"
						name="image"
						className="form-control"
						onChange={(e) => {
							setImage(e.target.files[0]);
						}}
					/>
					<div>Max. Size Permitted - 2MB </div>
				</div>
				<div className="d-grid">
					<button
						className="btn btn-primary"
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
					className="journal-message"
					style={{ display: messageDisplay, color: messageColor }}
				>
					{message}
				</div>
			</form>
		</div>
	);
}

export default AddJournal;
