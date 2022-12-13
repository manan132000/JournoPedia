import React, { useEffect, useState } from "react";
import Multistep from "react-multistep";
import StepOne from "./submit article/StepOne";
import StepThree from "./submit article/StepThree";
import StepTwo from "./submit article/StepTwo";
import StepFour from "./submit article/StepFour";
import "../css/AddArticle.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddArticle(props) {
	const [journal, setJournal] = useState({});
	const [articleName, setArticleName] = useState("Chat App");
	const [abstract, setAbstract] = useState(
		"This article contains how to make a chat app"
	);
	const [peerChoice, setPeerChoice] = useState([]);
	const [article, setArticle] = useState(null);
	const [authors, setAuthors] = useState([]);
	const [articleType, setArticleType] = useState("");
	const [cookies, setCookie] = useCookies(["token"]);
	const navigate = useNavigate();

	useEffect(() => {
		props.setDisplayItems(["none", "none", "inline"]);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("hello");
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};

		await axios
			.post(
				`http://localhost:5000/addArticle`,
				{
					article_name: articleName,
					peer_choice: peerChoice,
					article: article,
					abstract: abstract,
					journal_id: journal._id,
					authors: authors,
					article_type: articleType,
				},
				config
			)
			.then((res) => {
				console.log(res.data);
				if (res.data.message === "Article added successfully!") {
					navigate("/success");
				}
			});
	};

	const steps = [
		{ title: "Submission Guidelines", component: <StepOne /> },
		{
			title: "Article Details",
			component: (
				<StepTwo
					setJournal={setJournal}
					setArticleName={setArticleName}
					setAbstract={setAbstract}
					setArticle={setArticle}
					setArticleType={setArticleType}
				/>
			),
		},
		{
			title: "Peer Reviewer Details",
			component: <StepThree setPeerChoice={setPeerChoice} />,
		},
		{
			title: "Add Author",
			component: (
				<StepFour setAuthors={setAuthors} handleSubmit={handleSubmit} />
			),
		},
	];
	const btnStyle = {
		border: "none",
		padding: "8px 45px",
		borderRadius: "8px",
		background: "#33c2ef",
		color: "white",
	};
	console.log("peer choice : ", peerChoice);
	// 				article_name: articleName,
	// 				peer_choice: reviewer,
	// 				article: article,
	// 				abstract: abstract,
	// 				// journal_id: props.journalId,
	// 				authors: authorList,

	return (
		<div className="add-article-div">
			<Multistep
				prevStyle={{ ...btnStyle, marginLeft: "5%" }}
				nextStyle={{
					...btnStyle,
					position: "absolute",
					right: "18%",
				}}
				activeStep={0}
				showNavigation={true}
				steps={steps}
			/>
		</div>
	);
}

export default AddArticle;
