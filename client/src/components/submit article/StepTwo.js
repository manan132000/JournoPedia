import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-dropdown";
// import "../../css/AddArticle.css";
import "../../css/StepTwo.css";

function StepTwo(props) {
	const [article, setArticle] = useState("");
	const [articleName, setArticleName] = useState("");
	const [reviewer, setReviewer] = useState([]);
	const [articleType, setArticleType] = useState("");
	const [abstract, setAbstract] = useState("");
	const [journals, setJournals] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		axios.get(`http://localhost:5000/getAllJournals`).then((res) => {
			console.log(res.data);
			setJournals(res.data);
		});
	}, []);

	return (
		<div className="auth-inner add-article-form">
			<form>
				<h3>Add Article</h3>
				<label>Select Journal</label>
				<div className="mb-3">
					<Dropdown
						options={journals.map((journal) => {
							return journal.journal_name;
						})}
						onChange={(e) => {
							for (var i = 0; i < journals.length; i++)
								if (journals[i].journal_name === e.label)
									props.setJournal(journals[i]);
						}}
						// value={defaultOption}
						placeholder="Select an option"
					/>
				</div>
				<label>Select Article Type</label>
				<div className="mb-3">
					<Dropdown
						options={["Innovation", "Research"]}
						onChange={(e) => {
							props.setArticleType(e.value);
						}}
						// value={defaultOption}
						placeholder="Select an option"
					/>
				</div>
				<div className="mb-3">
					<label>Article Name</label>
					{/* getAllJournals */}
					<input
						type="text"
						className="form-control"
						// value={journalName}
						autoComplete="off"
						name="article_name"
						onChange={(e) => {
							props.setArticleName(e.target.value);
						}}
					/>
				</div>

				<div className="mb-3">
					<label>Abstract</label>
					<textarea
						type="text"
						className="form-control"
						value={abstract}
						name="abstract"
						onChange={(e) => {
							// setMessageDisplay("none");
							setAbstract(e.target.value);
							props.setAbstract(e.target.value);
						}}
					/>
				</div>

				<div className="mb-3">
					<label>Upload Article</label>
					<input
						type="file"
						name="article"
						className="form-control"
						onChange={(e) => {
							props.setArticle(e.target.files[0]);
						}}
					/>
					<div>Max. Size Permitted - 10MB </div>
				</div>
			</form>
		</div>
	);
}

export default StepTwo;
