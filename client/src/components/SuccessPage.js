import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/SuccessPage.css";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function SuccessPage(props) {
	const navigate = useNavigate();
	const [cookies, setCookie] = useCookies(["token"]);

	useEffect(() => {
		if (cookies.token) props.setDisplayItems(["none", "none", "inline"]);
		else props.setDisplayItems(["inline", "inline", "none"]);
		window.scrollTo(0, 0);
	}, []);
	const handleClick = () => {
		navigate("/");
		window.location.reload();
	};
	return (
		<div className="success-page-div">
			<div className="success-div">
				<h3 className="success-heading">
					Success <i class="far fa-check-circle"></i>
				</h3>
				<p className="success-p">
					Your article has been submitted successfully!
				</p>
			</div>
			<div className="home-link-div" onClick={handleClick}>
				Go to Home
			</div>
		</div>
	);
}

export default SuccessPage;
