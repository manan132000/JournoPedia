import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import "../css/VerifyPeerResponse.css";

function VerifyPeerResponse(props) {
	const [cookies, setCookie] = useCookies(["token"]);
	const [articles, setArticles] = useState([]);
	const [review1, setReview1] = useState("");
	const [review2, setReview2] = useState("");
	const [review3, setReview3] = useState("");
	const [review4, setReview4] = useState("");

	function handleDownload(id, num) {
		window.location.replace(
			`http://localhost:5000/${id}/peerReviewProof/${num}`
		);
	}

	function handleSubmit(id, num) {
		const config = {
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		if (num === 1) {
			axios
				.patch(
					`http://localhost:5000/scoreArticle/${id}`,
					{
						review_number: 1,
						review: review1,
					},
					config
				)
				.then((res) => {
					window.location.reload();
				});
		} else if (num === 2) {
			axios
				.patch(
					`http://localhost:5000/scoreArticle/${id}`,
					{
						review_number: 2,
						review: review2,
					},
					config
				)
				.then((res) => {
					window.location.reload();
				});
		} else if (num === 3) {
			axios
				.patch(
					`http://localhost:5000/scoreArticle/${id}`,
					{
						review_number: 3,
						review: review3,
					},
					config
				)
				.then((res) => {
					window.location.reload();
				});
		} else {
			axios
				.patch(
					`http://localhost:5000/scoreArticle/${id}`,
					{
						review_number: 4,
						review: review4,
					},
					config
				)
				.then((res) => {
					window.location.reload();
				});
		}
	}

	useEffect(() => {
		if (!cookies.token) props.setDisplayItems(["inline", "inline", "none"]);
		else props.setDisplayItems(["none", "none", "inline"]);
		const config = {
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios
			.get(`http://localhost:5000/allArticlesPeerResponseVerification`, config)
			.then((res) => {
				setArticles(res.data);
			});
	}, []);
	if (articles.length === 0) {
		return (
			<div className="review-page-div">
				<img className="no-articles-pic" src="images/no-articles.png" />
				<h3>Nothing to verify</h3>
			</div>
		);
	} else
		return (
			<div className="review-page-div">
				<div className="review-article-heading">Verify Peer Responses</div>
				{articles.map((article) => {
					return (
						<div key={article.article_id}>
							<div className="article-status-div">
								<div className="article-heading">{article.article_name}</div>
								{article.peer_review_1 && article.peer_review_1.status ? (
									<div>
										Peer Response 1 - {article.peer_review_1.status}
										<button
											className="submit-btn peer-btn"
											onClick={() => {
												handleDownload(article._id, 1);
											}}
										>
											Proof <i class="fas fa-download"></i>
										</button>
									</div>
								) : (
									<div className="peer-review-status peer-div">
										{article.peer_review_1 && article.peer_review_1.path ? (
											<div>
												<p>Peer Response 1 - </p>
												<Dropdown
													className="peer-review-status peer-dropdown"
													options={["Yes", "No"]}
													onChange={(e) => {
														setReview1(e.label);
													}}
													// value={defaultOption}
													placeholder="Verify Peer Response 1"
												/>
												<div className="btn-div">
													<button
														className="submit-btn peer-btn"
														onClick={() => {
															handleDownload(article._id, 1);
														}}
													>
														Proof <i class="fas fa-download"></i>
													</button>
													<button
														className="submit-btn peer-btn"
														onClick={() => {
															handleSubmit(article._id, 1);
														}}
													>
														Submit
													</button>
												</div>
											</div>
										) : (
											<div>No Proof Added for Peer Reviewer 1</div>
										)}
									</div>
								)}
								{article.peer_review_2 && article.peer_review_2.status ? (
									<div>
										Peer Response 2 - {article.peer_review_2.status}
										<button
											className="submit-btn"
											onClick={() => {
												handleDownload(article._id, 2);
											}}
										>
											Proof <i class="fas fa-download"></i>
										</button>
									</div>
								) : (
									<div className="peer-review-status peer-div">
										{article.peer_review_2 && article.peer_review_2.path ? (
											<div>
												<p>Peer Response 2 - </p>
												<Dropdown
													className="peer-review-status peer-dropdown"
													options={["Yes", "No"]}
													onChange={(e) => {
														setReview2(e.label);
													}}
													// value={defaultOption}
													placeholder="Verify Peer Response 2"
												/>
												<button
													className="submit-btn"
													onClick={() => {
														handleDownload(article._id, 2);
													}}
												>
													Proof <i class="fas fa-download"></i>
												</button>
												<button
													className="submit-btn"
													onClick={() => {
														handleSubmit(article._id, 2);
													}}
												>
													Submit
												</button>
											</div>
										) : (
											<div>No Proof Added for Peer Reviewer 2</div>
										)}
									</div>
								)}
								{article.peer_review_3 && article.peer_review_3.status ? (
									<div>
										Peer Response 3 - {article.peer_review_3.status}
										<button
											className="submit-btn"
											onClick={() => {
												handleDownload(article._id, 3);
											}}
										>
											Proof <i class="fas fa-download"></i>
										</button>
									</div>
								) : (
									<div className="peer-review-status peer-div">
										{article.peer_review_3 && article.peer_review_3.path ? (
											<div>
												<p>Peer Response 3 - </p>
												<Dropdown
													className="peer-review-status peer-dropdown"
													options={["Yes", "No"]}
													onChange={(e) => {
														setReview3(e.label);
													}}
													// value={defaultOption}
													placeholder="Verify Peer Response 3"
												/>
												<button
													className="submit-btn"
													onClick={() => {
														handleDownload(article._id, 3);
													}}
												>
													Proof <i class="fas fa-download"></i>
												</button>
												<button
													className="submit-btn"
													onClick={() => {
														handleSubmit(article._id, 3);
													}}
												>
													Submit
												</button>
											</div>
										) : (
											<div>No Proof Added for Peer Reviewer 3</div>
										)}
									</div>
								)}
								{article.peer_review_4 && article.peer_review_4.status ? (
									<div>
										Peer Response 4 - {article.peer_review_4.status}
										<button
											className="submit-btn"
											onClick={() => {
												handleDownload(article._id, 4);
											}}
										>
											Proof
										</button>
									</div>
								) : (
									<div className="peer-review-status peer-div">
										{article.peer_review_4 && article.peer_review_4.path ? (
											<div>
												<p>Peer Response 4 - </p>
												<Dropdown
													className="peer-review-status peer-dropdown"
													options={["Yes", "No"]}
													onChange={(e) => {
														setReview4(e.label);
													}}
													// value={defaultOption}
													placeholder="Verify Peer Response 4"
												/>
												<button
													className="submit-btn"
													onClick={() => {
														handleDownload(article._id, 4);
													}}
												>
													Proof
												</button>
												<button
													className="submit-btn"
													onClick={() => {
														handleSubmit(article._id, 4);
													}}
												>
													Submit
												</button>
											</div>
										) : (
											<div>No Proof Added for Peer Reviewer 4</div>
										)}
									</div>
								)}
								<div>
									DOS -
									{new Date(article.date_of_submission).toLocaleDateString(
										"en-GB"
									)}
								</div>
								<div>
									DOR -{" "}
									{new Date(article.date_of_review).toLocaleDateString("en-GB")}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
}

export default VerifyPeerResponse;
