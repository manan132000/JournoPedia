import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import "../css/Profile.css";
import { PuffLoader, FadeLoader } from "react-spinners";
import EditInfoPopup from "./EditInfoPopup";

function Profile(props) {
	const [cookies, setCookie] = useCookies(["token"]);
	const [userInfo, setUserInfo] = useState({});
	const [image, setImage] = useState();
	const [spinnerVisible, setSpinnerVisible] = useState("visible");
	const [imageUpload, setImageUpload] = useState(false);

	useEffect(() => {
		props.setDisplayItems(["none", "none", "inline"]);
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios.get(`http://localhost:5000/userDetailsToken`, config).then((res) => {
			console.log(res.data);
			setUserInfo(res.data);
			setSpinnerVisible("hidden");
			// console.log(res.data.image_path.slice(14));
		});
	}, []);

	const addPhoto = async (e) => {
		setImageUpload(true);
		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
				"access-control-allow-origin": "*",
				Authorization: "Bearer " + cookies.token,
			},
		};
		axios
			.patch(
				"http://localhost:5000/addProfilePhoto",
				{
					image: e.target.files[0],
				},
				config
			)
			.then((res) => {
				console.log(res.data);
				setImage(e.target.files[0]);
				setImageUpload(false);
			});
		window.location.reload();
	};

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
			<div className="profile-div">
			<div className="glass_profile">
				<div className="user-image-div">
					{imageUpload && (
						<div className="user-img-spinner">
							<FadeLoader
								cssOverride={{ display: "inline-block" }}
								loading={true}
								radius={2}
								aria-label="Loading Spinner"
								data-testid="loader"
							/>{" "}
						</div>
					)}
					<img
						src={
							imageUpload
								? "images/white-background.png"
								: userInfo.image_path === ""
								? "images/user-pic.png"
								: userInfo.image_path.slice(14)
						}
						className="user-pic"
					></img>
					<div className="add-photo-div">
						<label htmlFor="filePicker" style={{ cursor: "pointer" }}>
							<i class="fas fa-camera"></i>
						</label>
						<input
							id="filePicker"
							style={{ display: "none" }}
							type={"file"}
							name="image"
							accept="image/*"
							onChange={addPhoto}
						/>
					</div>
				</div>
				<div className="user-name-div">
					<div>
						<h1>{userInfo.name}</h1>
					</div>
					<div className="designation-div">
						<h4>
							{userInfo.designation} at {userInfo.institute}
						</h4>
					</div>
					<div className="country-div">
						From{" "}
						<img
							className="country-flag"
							src={`https://www.sciencekids.co.nz/images/pictures/flags680/${userInfo.country}.jpg`}
						/>{" "}
						{userInfo.country}
					</div>
				</div>
				</div>
				<div>
					<div
						className="circle left"
						style={{
							border: "8px solid #00D100",
							background: "rgb(158 232 158)",
						}}
					>
						{userInfo.total_accepted} <span>Accepted Articles</span>
					</div>
					<div
						className="circle center"
						style={{
							border: "8px solid #FF0000",
							background: "rgb(216 130 130)",
						}}
					>
						{userInfo.total_rejected} <span>Rejected Articles</span>
					</div>
					<div
						className="circle right"
						style={{ border: "8px solid blue", background: "#9a9ae4" }}
					>
						{userInfo.total_submitted} <span>Submitted Articles</span>
					</div>
				</div>
				<div className="more-info-div">
					<h4>More Information</h4>

					<div className="more-info-headings">
						<div>
							<span>Email</span>
						</div>
						<div>
							<span>Phone No</span>
						</div>
						<div>
							<span>Expertise</span>
						</div>
					</div>
					<div className="more-info">
						<div>{userInfo.email}</div>
						<div>{userInfo.phone}</div>
						<div>
							{userInfo.expertise &&
								userInfo.expertise.map((topic, i) => {
									console.log(topic);
									return (i > 0 ? ", " : "") + topic;
								})}
						</div>
					</div>

					<EditInfoPopup />
				</div>
			</div>
		);
}

export default Profile;
