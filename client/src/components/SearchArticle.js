import React, { useEffect, useState } from "react";
import MultiSelect from "react-multiple-select-dropdown-lite";
import axios from "axios";
import { useCookies } from "react-cookie";
import getDate from "../utils/getTodayDate";
import "../css/SearchArticle.css";
import "react-dropdown/style.css";
import { PuffLoader } from "react-spinners";

function SearchArticle(props) {
	function formatDate(inputDate) {
		var date = new Date(inputDate);
		if (!isNaN(date.getTime())) {
			return (
				String(date.getMonth() + 1).padStart(2, "0") +
				"/" +
				String(date.getDate()).padStart(2, "0") +
				"/" +
				date.getFullYear()
			);
		}
	}

	const [cookies, setCookie] = useCookies(["token"]);
	const [journals, setJournals] = useState([]);
	const [journalNames, setJournalNames] = useState([]);
	const [selectedJournals, setSelectedJournals] = useState([]);
	const [foundArticles, setFoundArticles] = useState([]);
	const [dateOfSubmission, setDateOfSubmission] = useState({
		start: formatDate("01/01/1980"),
		end: getDate(),
	});
	const [articleType, setArticleType] = useState(["Innovation", "Research"]);
	const [status, setStatus] = useState(["Under Peer Review", "Peer Accepted"]);
	const [errorDisplay, setErrorDisplay] = useState("none");
	const [found, setFound] = useState(false);
	const [initialSpinnerVisible, setInitialSpinnerVisible] = useState(true);
	const [spinnerVisible, setSpinnerVisible] = useState("hidden");
	const [searched, setSearched] = useState(false);

	useEffect(() => {
		props.setDisplayItems(["none", "none", "inline"]);
		axios.get(`http://localhost:5000/getAllJournals`).then((res) => {
			setJournals(res.data);
			setJournalNames(
				res.data.map((journal) => {
					return { value: journal._id, label: journal.journal_name };
				})
			);
			setInitialSpinnerVisible(false);
		});
	}, []);

	const handleSubmit = () => {
		setFound(false);
		setDateOfSubmission({
			start: formatDate(dateOfSubmission.start),
			end: formatDate(dateOfSubmission.end),
		});
		console.log(selectedJournals);
		console.log(dateOfSubmission);
		console.log(articleType);
		console.log(status);
		if (selectedJournals.length === 0) {
			setErrorDisplay("block");
			return;
		}
		setSpinnerVisible("visible");
		const config = {
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios
			.post(
				"http://localhost:5000/searchArticles",
				{
					article_type: articleType,
					status: status,
					date: dateOfSubmission,
					journal: selectedJournals,
				},
				config
			)
			.then((res) => {
				setFoundArticles(res.data);
				if (res.data.length !== 0) setFound(true);
				setSpinnerVisible("hidden");
				setSearched(true);
			});
	};

	const handleOnTopicChange = (journals) => {
		setErrorDisplay("none");
		let str = "";
		let journalArr = [];
		for (let c of journals) {
			if (c === ",") {
				journalArr.push(str);
				str = "";
			} else {
				str += c;
			}
		}
		journalArr.push(str);
		setSelectedJournals(journalArr);
	};

	function handleDownload(articleId) {
		window.location.replace(
			`http://localhost:5000/downloadArticle/${articleId}`
		);
	}

	if (initialSpinnerVisible) {
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
			<div className="search-article-div">
				<div className="search-article-heading">Looking for an article?</div>

				<div className="filter-article-div">
					{/**************************************  Date of Submission********************************************/}
					<div className="filter-div date-div">
						<label className="time-heading">Time Range</label>
						<br />
						<label>From</label>
						<input
							className="from-date-input filter-input form-control"
							type="date"
							onChange={(e) => {
								setDateOfSubmission({
									...dateOfSubmission,
									start: formatDate(e.target.value),
								});
							}}
						/>
						<br />
						<label>To</label>
						<input
							className="to-date-input filter-input form-control"
							type="date"
							onChange={(e) => {
								setDateOfSubmission({
									...dateOfSubmission,
									end: formatDate(e.target.value),
								});
							}}
						/>
					</div>

					{/************************************** Article Type Checkbox********************************************/}
					<div className="filter-div article-type-div">
						<label>Article type</label>
						<br />
						<input
							type="checkbox"
							id="Innovation"
							name="Innovation"
							value="Innovation"
							className="checkbox-input"
							onChange={(e) => {
								if (e.target.checked) {
									if (articleType.length === 0) setArticleType(["Innovation"]);
									else setArticleType(["Innovation", "Research"]);
								} else {
									if (articleType.length === 2) setArticleType(["Research"]);
									else setArticleType(["Innovation", "Research"]);
								}
							}}
						/>
						<label className="filter-label" for="Innovation">
							{" "}
							Innovation
						</label>
						<br />
						<input
							type="checkbox"
							className="checkbox-input"
							id="Research"
							name="Research"
							value="Research"
							onChange={(e) => {
								if (e.target.checked) {
									if (articleType.length === 0) setArticleType(["Research"]);
									else setArticleType(["Innovation", "Research"]);
								} else {
									if (articleType.length === 2) setArticleType(["Innovation"]);
									else setArticleType(["Innovation", "Research"]);
								}
							}}
						/>
						<label className="filter-label" for="Research">
							{" "}
							Research
						</label>
						<br></br>
					</div>
					{/************************************** Status Checkbox********************************************/}
					<div className="filter-div">
						<label>Status</label>
						<br />
						<input
							type="checkbox"
							id="Editor Approved"
							className="checkbox-input"
							name="Editor Approved"
							value="Editor Approved"
							onChange={(e) => {
								if (e.target.checked) {
									if (status.length === 0) setStatus(["Under Peer Review"]);
									else setStatus(["Under Peer Review", "Peer Accepted"]);
								} else {
									if (status.length === 2) setStatus(["Peer Accepted"]);
									else setStatus(["Under Peer Review", "Peer Accepted"]);
								}
							}}
						/>
						<label className="filter-label" for="Editor Approved">
							{" "}
							Editor Approved
						</label>
						<br />
						<input
							type="checkbox"
							id="Peer Approved"
							name="Peer Approved"
							value="Peer Approved"
							className="checkbox-input"
							onChange={(e) => {
								if (e.target.checked) {
									if (status.length === 0) setStatus(["Peer Accepted"]);
									else setStatus(["Under Peer Review", "Peer Accepted"]);
								} else {
									if (status.length === 2) setStatus(["Under Peer Review"]);
									else setStatus(["Under Peer Review", "Peer Accepted"]);
								}
							}}
						/>
						<label className="filter-label" for="Peer Approved">
							{" "}
							Peer Approved
						</label>
						<br></br>
					</div>
				</div>

				{/**************************************  Select Journal(s)********************************************/}
				<div className="filter-div filter-journal-div">
					<label>Select Journal(s)*</label>
					<MultiSelect
						width={"50%"}
						onChange={handleOnTopicChange}
						options={journalNames}
					/>
				</div>
				<div className="no-journal-error" style={{ display: errorDisplay }}>
					No Journal Selected
				</div>
				<div className="filter-search-btn-div">
					<button className="filter-search-btn" onClick={handleSubmit}>
						Search
					</button>
				</div>
				{spinnerVisible === "visible" && (
					<div className="loading-div">
						<PuffLoader
							cssOverride={{ display: "inline-block" }}
							loading={true}
							size={40}
							aria-label="Loading Spinner"
							data-testid="loader"
						/>
					</div>
				)}
				{found && spinnerVisible === "hidden" && (
					<div className="found-articles-div">
						{foundArticles.map((article) => {
							return (
								<div
									onClick={() => {
										handleDownload(article._id);
									}}
								>
									<div className="found-article-name">
										{article.article_name} <i class="fas fa-download"></i>
									</div>
								</div>
							);
						})}
					</div>
				)}
				{!found && searched && (
					<div className="not-found-articles-div">No Articles Found</div>
				)}
			</div>
		);
}

export default SearchArticle;
