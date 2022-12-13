import React from "react";

function StepOne() {
	return (
		<div className="guidelines-div">
			<div className="step-div">
				<h4>Step: 1</h4>
				<p>
					Choose a journal for which you want to submit the article. Add a
					suitable name for your article and then upload the desired file.
					<b> Note: The file should only be in .pdf or .docx format</b>
				</p>
			</div>
			<div className="step-div">
				<h4>Step: 2</h4>
				<p>
					Provide the information of the expert reviewers from whom you want to
					review your article. Enter their respective names, email IDs, phone
					number, and country. <b>Note: The country of each reviewer has to be
					different, otherwise your aticle will not be submitted.</b>
				</p>
			</div>
			<div className="step-div">
				<h4>Step: 3</h4>
				<p>
					<b>(Optional)</b> Provide the information of any co-authors for the article
					that you wish to submit. Enter their respective names, email IDs,
					phone number, and country.
				</p>
			</div>
		</div>
	);
}

export default StepOne;
