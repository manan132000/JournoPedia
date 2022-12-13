import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { PuffLoader } from "react-spinners";
import "../css/Volumes.css";

function Volume(props) {
	const [cookies, setCookie] = useCookies(["token"]);
	const { journal_id, year } = useParams();
	const [articles, setArticles] = useState([]);
	const [authorIDs, setAuthorIDs] = useState([]);
	const [authorNames, setAuthorNames] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (cookies.token) props.setDisplayItems(["none", "none", "inline"]);
		else props.setDisplayItems(["inline", "inline", "none"]);

		window.scrollTo(0, 0);
		axios
			.get(`http://localhost:5000/${journal_id}/volume/${year}`)
			.then((res) => {
				console.log(res.data);
				setArticles(res.data);
				setAuthorIDs(
					res.data.map((author) => {
						return author.submitted_by;
					})
				);
			});
		// console.log(articles);
		// const authorFetch = async () => {

		// };
		// authorFetch();
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
				`http://localhost:5000/getAllAuthors`,
				{
					allIds: authorIDs,
				},
				config
			)
			.then((res) => {
				// console.log(res.data);
				setAuthorNames(
					res.data.map((author) => {
						return author.name;
					})
				);
				setIsLoading(false);
			});
	}, [authorIDs]);

	function handleDownload(e) {
		const articleId = e.target.value;
		window.location.replace(
			`http://localhost:5000/downloadArticle/${articleId}`
		);
	}

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
			<div className="volumes-div">
				<div className="review-article-heading">Articles</div>
				<div className="volume-articles-div">
					{articles.map((article, index) => {
						return (
							<div className="border_article">
								<span>{index + 1}. </span>
								<span>{article.article_name}</span>
								<div>Author - {authorNames[index]}</div>
								<div>Co-Authors - </div>
								{article.authors.map((author) => {
									return (
										<p>
											{author.name}, {author.email}, {author.country} <br></br>
										</p>
									);
								})}
								<div>
									Date of Submission -{" "}
									{new Date(article.date_of_submission).toLocaleDateString(
										"en-GB"
									)}
								</div>
								<div>Status - {article.status}</div>
								<button
									className="download-btn"
									value={article._id}
									onClick={handleDownload}
								>
									Download <i class="fas fa-download"></i>
								</button>
							</div>
						);
					})}
				</div>
			</div>
		);
}

export default Volume;
