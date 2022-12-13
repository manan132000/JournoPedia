import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "../css/ReviewPage.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { PuffLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function ReviewPage(props) {
	const [cookies, setCookie] = useCookies(["token"]);
	const [articles, setArticles] = useState([]);
	const [noArticlesMessage, setNoArticlesMessage] = useState(null);
	const [passForReview, setPassForReview] = useState("");
	const [articlesCount, setArticlesCount] = useState(0);
	const [articlesForReviewCount, setArticlesForReviewCount] = useState(0);
	const [spinnerVisible, setSpinnerVisible] = useState("visible");
	const [journalNames, setJournalNames] = useState([]);
	const [journalIds, setJournalIds] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		props.setDisplayItems(["none", "none", "inline"]);
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios
			.get(`http://localhost:5000/allArticlesForReferral`, config)
			.then((res) => {
				// setSpinnerVisible("hidden");
				if (res.data.message === "No articles for review") {
					setNoArticlesMessage(res.data.message);
				}
				setArticles(res.data);

				if (articles.length) {
					setJournalIds(
						res.data.map((journal) => {
							return journal.journal;
						})
					);
				}

				var articlesForReviewCount = 0;
				for (var i = 0; i < res.data.length; i++)
					if (res.data[i].status === "Under Review") articlesForReviewCount++;

				let count = 0;
				res.data.map((article) => {
					if (article.status !== "Withdrawn") {
						count++;
					}
				});
				setArticlesCount(count);
				setArticlesForReviewCount(articlesForReviewCount);
				setSpinnerVisible("hidden");
				// console.log(res.data);
			});
	}, []);

	useEffect(() => {
		const config = {
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};

		axios
			.post(
				`http://localhost:5000/journalNameByIds`,
				{
					allIds: journalIds,
				},
				config
			)
			.then((res) => {
				setJournalNames(
					journalIds.map((journalId, index) => {
						return res.data[journalId];
					})
				);
			});
	}, [journalIds]);

	function handleDownload(e) {
		const articleId = e.target.value;
		window.location.replace(
			`http://localhost:5000/downloadArticle/${articleId}`
		);
	}

	async function handleSubmit(id) {
		// e.preventDefault();
		const config = {
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		// console.log(passForReview);
		await axios
			.post(
				`http://localhost:5000/referArticle/${id}`,
				{
					option: passForReview,
				},
				config
			)
			.then((res) => {
				console.log(res.data);
				window.location.reload();
			});
	}
	console.log(journalNames);
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
	} else if (noArticlesMessage) {
		return (
			<div className="review-page-div">
				<img className="no-articles-pic" src="images/no-articles.png" />
				<h3>No Articles to Review</h3>
			</div>
		);
	} else
		return (
			<div className="review-page-div">
				{articlesForReviewCount > 0 && (
					<>
						<div className="review-article-heading">
							{articlesForReviewCount}{" "}
							{articlesForReviewCount == 1 ? "Article" : "Articles"} to Review
						</div>
						<table className="articles-table">
							{articles.map((item) => {
								if (item.status === "Under Review")
									return (
										<tr className="articles-tr">
											<td className="td-1">
												<div className="article-heading">
													{item.article_name}
												</div>
											</td>
											<td className="td-2">
												<button
													className="download-btn"
													value={item._id}
													onClick={handleDownload}
												>
													Download <i class="fas fa-download"></i>
												</button>
												<Dropdown
													className="review-dropdown"
													options={["Yes", "No"]}
													onChange={(e) => {
														setPassForReview(e.label);
													}}
													// value={defaultOption}
													placeholder="Pass for peer review"
												/>
												<button
													// type="submit"
													className="submit-btn"
													onClick={() => {
														handleSubmit(item._id);
													}}
												>
													Submit
												</button>
											</td>
										</tr>
									);
							})}
						</table>
					</>
				)}

				{articlesCount - articlesForReviewCount > 0 && (
					<>
						<div className="review-article-heading">
							{articlesCount - articlesForReviewCount}{" "}
							{articlesCount - articlesForReviewCount == 1
								? "Article"
								: "Articles"}{" "}
							Already Reviewed
						</div>
						<table className="articles-table">
							{articles.map((item, index) => {
								if (
									item.status === "Under Peer Review" ||
									item.status === "Peer Accepted" ||
									item.status === "Rejected"
								)
									return (
										<tr className="articles-tr">
											<td className="td-1">
												<div className="article-heading">
													{item.article_name}
													<div className="article-heading-journal-name">
														{journalNames[index]}
														<br></br>
														DOR -{" "}
														{new Date(item.date_of_review).toLocaleDateString(
															"en-GB"
														)}
													</div>
												</div>
											</td>
											<td className="td-2">
												<button
													className="download-btn"
													value={item._id}
													onClick={handleDownload}
												>
													Download <i class="fas fa-download"></i>
												</button>
												<button
													className="download-btn"
													style={
														item.status === "Under Peer Review" ||
														item.status === "Peer Accepted"
															? { background: "#4db8db" }
															: { background: "#e96262" }
													}
												>
													{item.status === "Under Peer Review" ||
													item.status === "Peer Accepted"
														? "Approved"
														: "Rejected"}
												</button>
											</td>
										</tr>
									);
							})}
						</table>
					</>
				)}
			</div>
		);
}

export default ReviewPage;
