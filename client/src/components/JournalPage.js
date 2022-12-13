import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/JournalPage.css";
// import img from '../../public/images/'
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Tabs, Tab } from "react-bootstrap";
import { PuffLoader } from "react-spinners";
import AddEditorsPopup from "./AddEditorsPopup";

function JournalPage(props) {
	const [img, setImg] = useState("");
	const [journalName, setJournalName] = useState("");
	const [author, setAuthor] = useState("");
	const [otherAuthor, setOtherAuthor] = useState([]);
	const [synopsis, setSynopsis] = useState("");
	const [cookies, setCookie] = useCookies(["token"]);
	const [volumes, setVolumes] = useState([]);
	const [spinnerVisible, setSpinnerVisible] = useState("visible");
	const [score, setScore] = useState(0);
	const [userRole, setUserRole] = useState("");
	let navigate = useNavigate();
	console.log(score)
	useEffect(() => {
		if (cookies.token) props.setDisplayItems(["none", "none", "inline"]);
		else props.setDisplayItems(["inline", "inline", "none"]);

		const config = {
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};

		axios
			.get(`http://localhost:5000/viewJournal/${props.journalId}`)
			.then((res) => {
				setImg(res.data.journal.image.substr(14));
				setJournalName(res.data.journal.journal_name);
				setSynopsis(res.data.journal.synopsis);
				setAuthor(res.data.author.name);

				let otherAuthors = [];

				for (let i = 0; i < res.data.otherAuthors.length; i++) {
					otherAuthors.push(res.data.otherAuthors[i].name);
				}
				setOtherAuthor(otherAuthors);
				setSpinnerVisible("hidden");
			});

		axios
			.get(`http://localhost:5000/getNumberVolumes/${props.journalId}`)
			.then((res) => {
				setVolumes(res.data.volumes);
			});
		axios
			.get(`http://localhost:5000/journalScore/${props.journalId}`)
			.then((res) => {
				setScore(res.data.score);
			});
		axios.get(`http://localhost:5000/userDetailsToken`, config).then((res) => {
			setUserRole(res.data.userRole);
		});
	}, []);

	if (spinnerVisible === "visible") {
		return (
			<div className="loading-div">
				<PuffLoader
					cssOverride={{ display: "inline-block" }}
					loading={true}
					size={40}
					aria-label="Loading Spinner"
					data-testid="loader"
				/>{" "}
				<span className="loading">Loading</span>
			</div>
		);
	} else
		return (
			<div className="journal-page-div">
				<div className="journal-info-div">
					<h2 className="journal-heading">{journalName}</h2>
				</div>
				<div className="journal-details">
					<div className="journal-img-div">
						<img className="journal-img" src={`/${img}`} alt={journalName} />
					</div>
					<div className="editor-in-chief-div">
						<h5>Editor in Chief</h5>
						<p className="">{author}</p>
						<h5>Journal Score</h5>
						<p className="">{score === null?0:score}/100</p>
					</div>
					<div className="synopsis-div">
						<h5>Synopsis</h5>
						<p className="synopsis">{synopsis}</p>
					</div>
					<Tabs
						defaultActiveKey="home"
						id="uncontrolled-tab-example"
						className="mb-3 tabs"
					>
						<Tab eventKey="home" title="Editorial Board">
							<div className="editorial-board-div">
								<h5>Editor in Chief</h5>
								<p className="">{author}</p>
								<h5>
									Editorial Board Members{" "}
									{userRole === "Admin" && (
										<AddEditorsPopup journalId={props.journalId} />
									)}
								</h5>
								<ul>
									{otherAuthor.map((author) => (
										<li className="">{author}</li>
									))}
								</ul>
							</div>
						</Tab>
						<Tab eventKey="guidelines" title="Submitting Articles">
							<div className="journal-submission-guidelines-div">
								<ul>
									<li>
										Submitted articles should not have been previously published
										or be currently under consideration for publication
										elsewhere.
									</li>
									<li>
										Briefs and research notes are not published in this journal.
									</li>
									<li>
										All our articles go through a double-blind review process.
									</li>
									<li>There are no charges for publishing with JournoPedia.</li>
								</ul>
							</div>
						</Tab>
					</Tabs>
					<div className="volume-links-div">
						<h5>Volumes</h5>
						<div>
							{volumes.map((volume, index) => {
								return (
									<Link to={`/${props.journalId}/volume/${volume}`}>
										Volume {volumes.length - index}
										<br></br>
									</Link>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
}

export default JournalPage;
