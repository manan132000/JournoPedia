import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import "../css/AddPeerResponse.css";
import { PuffLoader } from "react-spinners";
import axios from "axios";

function AddPeerResponse(props) {
	const [cookies, setCookie] = useCookies(["token", "articleId"]);
	const [article, setArticle] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [counter, setCounter] = useState(0);
	const [numAuthors, setNumAuthors] = useState(0);
	const [articleId, setArticleId] = useState(props.openedArticleId);
	const [proofs, setProofs] = useState([]);

	useEffect(() => {
		if (!cookies.token) props.setDisplayItems(["inline", "inline", "none"]);
		else props.setDisplayItems(["none", "none", "inline"]);

		if (!cookies.articleId) {
			console.log("here");
			setCookie("articleId", props.openedArticleId, { path: "/" });
		}
	}, []);

	useEffect(() => {
		console.log("article id ", cookies.articleId);

		const config = {
			headers: {
				"Content-Type": "application/json",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios
			.get(`http://localhost:5000/viewArticle/${cookies.articleId}`, config)
			.then((res) => {
				console.log(res.data);
				setIsLoading(false);
				setArticle(res.data);
			});
	}, [cookies.articleId]);

	const handleClick = (e) => {
		e.preventDefault();
		setCounter(counter + 1);
		setNumAuthors(numAuthors + 1);
	};

	const handleSubmit = (num) => {
		console.log(num);
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios
			.post(
				`http://localhost:5000/addPeerReviewDetails/${cookies.articleId}`,
				{
					image: proofs[num - 1],
				},
				config
			)
			.then((res) => {
				console.log(res.data);
				window.location.reload();
			});
	};

	if (isLoading) {
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
			<div className="add-peer-response-div">
				<div className="review-article-heading">
					Submit Peer Response for "{article.article_name}"
				</div>

				<div className="auth-inner mb-3">
					Peer Review 1{" "}
					{article.peer_review_1.status ? (
						article.peer_review_1.status
					) : article.peer_review_1.path ? (
						<div>"Verification pending"</div>
					) : (
						<form>
							<input
								className="form-control peer-response-input"
								type="file"
								onChange={(e) => {
									let arr = proofs;
									arr[0] = e.target.files[0];
									setProofs(arr);
								}}
							></input>
							<button
								className="peer-response-submit-btn"
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									handleSubmit(1);
								}}
							>
								Submit
							</button>
						</form>
					)}
				</div>

				<div className="auth-inner mb-3">
					Peer Review 2{" "}
					{article.peer_review_2.status ? (
						article.peer_review_2.status
					) : article.peer_review_2.path ? (
						<div>"Verification pending"</div>
					) : (
						<form>
							<input
								className="form-control peer-response-input"
								type="file"
								onChange={(e) => {
									let arr = proofs;
									arr[1] = e.target.files[0];
									setProofs(arr);
								}}
							></input>
							<button
								className="peer-response-submit-btn"
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									handleSubmit(2);
								}}
							>
								Submit
							</button>
						</form>
					)}
				</div>

				<div className="auth-inner mb-3">
					Peer Review 3{" "}
					{article.peer_review_3.status ? (
						article.peer_review_3.status
					) : article.peer_review_3.path ? (
						<div>"Verification pending"</div>
					) : (
						<form>
							<input
								className="form-control peer-response-input"
								type="file"
								onChange={(e) => {
									let arr = proofs;
									arr[2] = e.target.files[0];
									setProofs(arr);
								}}
							></input>
							<button
								className="peer-response-submit-btn"
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									handleSubmit(3);
								}}
							>
								Submit
							</button>
						</form>
					)}
				</div>

				<div className="auth-inner mb-3">
					Peer Review 4{" "}
					{article.peer_review_4.status ? (
						article.peer_review_4.status
					) : article.peer_review_4.path ? (
						<div>"Verification pending"</div>
					) : (
						<form>
							<input
								className="form-control peer-response-input"
								type="file"
								onChange={(e) => {
									let arr = proofs;
									arr[3] = e.target.files[0];
									setProofs(arr);
								}}
							></input>
							<button
								className="peer-response-submit-btn"
								type="submit"
								onClick={(e) => {
									e.preventDefault();
									handleSubmit(4);
								}}
							>
								Submit
							</button>
						</form>
					)}
				</div>
			</div>
		);
}

export default AddPeerResponse;
