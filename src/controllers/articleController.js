const { Article } = require("../models/article");
const { User } = require("../models/user");
const { Journal } = require("../models/journal");
const fs = require("fs");
const { mail } = require("../utils/mailing");

//@route    POST /addArticle
//@descr    Add a article
//@access   Private

const addArticle = async (req, res) => {
	try {
		const { journal_id, peer_choice, article_name, authors, article_type } =
			req.body;

		let country = new Set();
		for (let i = 0; i < peer_choice.length; i++) {
			country.add(peer_choice[i].countryValues);
		}

		if (country.size != 4) {
			return res.send({
				message: "All reviewers must be from different countries.",
			});
		}

		const user = await User.findById(req.rootuser._id);
		if (country.has(user.country)) {
			return res.send({
				message: "Reviewer needs to be of different country from the author",
			});
		}

		if (!journal_id) {
			return res.send({
				message: "Journal_id cannot be empty",
			});
		}
		if (!req.file) {
			return res.send({
				message: "File cannot be empty",
			});
		}

		const newArticle = new Article({
			article_name: article_name,
			original_name: req.file.originalname,
			journal: journal_id,
			submitted_by: req.rootuser,
			path: req.file.path,
			size: req.file.size,
			status: "Under Review",
			peer_choice: peer_choice,
			authors: authors,
			article_type: article_type,
		});

		const journal = await Journal.findById(journal_id);
		let editorIds = journal.editors;

		const allEditors = await User.find({ _id: { $in: editorIds } });

		let mailingList = [];
		for (let i = 0; i < allEditors.length; i++) {
			mailingList.push(allEditors[i].email);
		}
		const mailBody = `<h4>Greetings from Journopedia Team,</h4>
    <p>A new article has been submitted by ${user.name} . 
    The article has been submitted under the journal - ${journal.journal_name} .<br> 
    Please review the article and examine it for peer review process.
    </p>
    <div>Author Details <br> 
    Name - ${user.name} <br> 
    Email - ${user.email} <br> 
    Phone - ${user.phone} <br> 
    Designation - ${user.designation} <br> 
    Institute - ${user.institute} <br> 
    Country - ${user.country} <br> 
    </div>
    <br>
    <div>Regards,<br>Team JournPedia</div>`;

		const attachments = [
			{
				filename: req.file.originalname,
				path: req.file.path,
			},
		];

		const save = await newArticle.save();

		if (save) {
			const id = req.rootuser._id;
			const total_submitted = req.rootuser.total_submitted;
			const update = await User.findByIdAndUpdate(id, {
				total_submitted: total_submitted + 1,
			});
			mail(mailingList, mailBody, attachments);
			res.send({
				message: "Article added successfully!",
			});
		} else {
			res.send({
				message: "Article not added!",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route    GET /downloadArticle/:article_id
//@descr    Download Article by Id
//@access   Public

const downloadArticle = async (req, res) => {
	try {
		const { article_id } = req.params;
		const findArticle = await Article.findById(article_id);

		const updateArticle = await Article.findByIdAndUpdate(article_id, {
			$inc: { downloads: 1 },
		});
		if (updateArticle) {
			res.download(findArticle.path);
		}
	} catch (error) {
		console.log(error);
	}
};

//@route    POST /withdrawArticle/:article_id
//@descr    Withdraw a article by Id
//@access   Private

const withdrawArticle = async (req, res) => {
	try {
		const { article_id } = req.params;
		const article = await Article.findById(article_id);

		const updateUser = await User.findByIdAndUpdate(article.submitted_by, {
			$inc: { total_withdrawn: 1 },
		});

		const path = article.path;
		const withdraw = await Article.findByIdAndUpdate(article_id, {
			status: "Withdrawn",
			path: "",
			date_of_withdrawal: new Date(),
		});

		if (withdraw) {
			fs.unlink(path, (err) => {
				if (err) {
					console.log(err);
				} else {
					res.send({
						message: "Article withdrawn succesfully!",
					});
				}
			});
		} else {
			res.send({
				message: "Article not found!",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route    POST /referArticle/:article_id
//@descr    Forward artcile for peer review
//@access   Private

const referArticle = async (req, res) => {
	try {
		const { article_id } = req.params;
		const { option } = req.body;

		const article = await Article.findById(article_id);
		const journal_id = article.journal;
		const journal = await Journal.findById(journal_id);
		let editorList = journal.editors;
		editorList.push(journal.author);
		const author = await User.findById(article.submitted_by);

		let mailingList = [];
		for (let i = 0; i < article.peer_choice.length; i++) {
			mailingList.push(article.peer_choice[i].email);
		}

		const mailBody = `<h4>Greetings from Journopedia Team,</h4>
    <p>You have been choosen to peer review an article by ${author.name} . The article has been accepted by our editorial team. 
    The article has been submitted under the journal - ${journal.journal_name}.<br> 
    Please review the article and score it for further publishing process.
    </p>
    <div>Author Details <br> 
    Name - ${author.name} <br> 
    Email - ${author.email} <br> 
    Phone - ${author.phone} <br> 
    Designation - ${author.designation} <br> 
    Institute - ${author.institute} <br> 
    Country - ${author.country} <br> 
    </div>
    <p>Kindly revert back with your review of the article to the author.</p>
    
    <div>Regards,<br>Team JournPedia</div>`;

		const attachments = [
			{
				filename: article.original_name,
				path: article.path,
			},
		];

		if (editorList.includes(req.rootuser._id)) {
			if (option == "Yes") {
				mail(mailingList, mailBody, attachments);
				updateStatus = await Article.findByIdAndUpdate(article_id, {
					status: "Under Peer Review",
					reviewed_by: req.rootuser,
					date_of_review: new Date(),
				});

				updateUser = await User.findByIdAndUpdate(article.submitted_by, {
					$inc: { total_accepted: 1 },
				});
			} else {
				updateStatus = await Article.findByIdAndUpdate(article_id, {
					status: "Rejected",
					reviewed_by: req.rootuser,
					date_of_review: new Date(),
				});
				updateUser = await User.findByIdAndUpdate(article.submitted_by, {
					$inc: { total_rejected: 1 },
				});
			}
		} else {
			return res.send({
				message: "Unauthorized",
			});
		}
		if (updateStatus) {
			res.send({
				message: "Article status updated",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route    GET /allArticlesForReferral
//@descr    Fetch all articles to be referred for peer review
//@access   Private

const allArticlesForReferral = async (req, res) => {
	try {
		const journals = await Journal.find({
			$or: [{ author: req.rootuser._id }, { editors: req.rootuser._id }],
		});

		let journalIds = [];

		for (let i = 0; i < journals.length; i++) {
			journalIds.push(journals[i]._id);
		}

		const articles = await Article.find({ journal: { $in: journalIds } });

		if (articles && articles.length) {
			res.send(articles);
		} else {
			res.send({
				message: "No articles for review",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route	GET /articleStatus
//@descr	Get all articles with their status
//@access	Private

const articleStatus = async (req, res) => {
	try {
		const allArticles = await Article.find({ submitted_by: req.rootuser._id });
		if (allArticles) {
			res.send(allArticles);
		} else {
			res.send({
				message: "No articles submitted",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route	GET /getNumberVolumes/:journal_id
//@descr	Get no. of all volumes
//@access	Public

const getNumberVolumes = async (req, res) => {
	try {
		const { journal_id } = req.params;
		
		const allArticles = await Article.find({ journal: journal_id , status: {$in:["Peer Accepted","Under Peer Review"]}});
		
		let yearList = new Set();
		for (let i = 0; i < allArticles.length; i++) {
			yearList.add(allArticles[i].date_of_submission.getFullYear());
		}
		let volumes = [...yearList];
		volumes = volumes.sort().reverse();
		return res.send({
			volumes,
			journal_id,
		});
	} catch (error) {
		console.log(error);
	}
};

//@route  GET /:journal_id/volume/:year
//@descr  Get a particular volume
//@access Public

const volume = async (req, res) => {
	try {
		const { year, journal_id } = req.params;

		const startDate = new Date(year);
		const endDate = new Date(new Date(year, 12, 1) - 1);
		const allArticles = await Article.find({
			journal: journal_id,
			date_of_submission: {
				$gte: startDate,
				$lte: endDate,
			},
			status: {$in:["Under Peer Review","Peer Accepted"]}
		});
		
		if (allArticles) {
			res.send(allArticles);
		} else {
			res.send({
				message: "No articles found",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route	POST /searchArticles
//@descr	Get all articles using a filter
//@access	Public

const searchArticles = async (req, res) => {
	try {
		const { article_type, status, date, journal } = req.body;
		const startDate = new Date(date.start).toISOString();
		const endDate = new Date(date.end).toISOString();
		const allArticles = await Article.find({
			journal: { $in: journal },
			status: { $in: status },
			article_type: { $in: article_type },
			date_of_submission: {
				$gte: startDate,
				$lte: endDate,
			},
		});

		if (allArticles) {
			res.send(allArticles);
		} else {
			res.send({
				message: "No Articles Found",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route	POST /addPeerReviewDetails/:article_id
//@descr	Add Peer Review Proof
//@access	Private

const addPeerReviewDetails = async (req, res) => {
	try {
		if (!req.file) {
			return res.send({
				message: "File can not be empty",
			});
		}

		const { article_id } = req.params;

		const findArticle = await Article.findById(article_id);
		let peer_review_count = 0;

		if (findArticle.peer_review_1.path) {
			peer_review_count++;
		}
		if (findArticle.peer_review_2.path) {
			peer_review_count++;
		}
		if (findArticle.peer_review_3.path) {
			peer_review_count++;
		}
		if (findArticle.peer_review_4.path) {
			peer_review_count++;
		}

		if (peer_review_count == 0) {
			updatePeerReview = await Article.findByIdAndUpdate(article_id, {
				peer_review_1: {
					path: req.file.path,
					status: ""
				},
			});
		} else if (peer_review_count == 1) {
			updatePeerReview = await Article.findByIdAndUpdate(article_id, {
				peer_review_2: {
					path: req.file.path,
					status: ""
				},
			});
		} else if (peer_review_count == 2) {
			updatePeerReview = await Article.findByIdAndUpdate(article_id, {
				peer_review_3: {
					path: req.file.path,
					status: ""
				},
			});
		} else if (peer_review_count == 3) {
			updatePeerReview = await Article.findByIdAndUpdate(article_id, {
				peer_review_4: {
					path: req.file.path,
					status: ""
				},
			});
		} else {
			return res.send({
				message: "Already review statuses present",
			});
		}

		if (updatePeerReview) {
			res.send({
				message: "Peer Review Added",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route	PATCH /scoreArticle/:article_id
//@descr	Accept/Reject peer review by editorial board
//@access	Private

const scoreArticle = async (req, res) => {
	try {
		const { article_id } = req.params;
		const { review_number, review } = req.body;

		const article = await Article.findById(article_id);
		const peer_review_score = article.peer_review_score;
		const path1 = article.peer_review_1.path;
		const path2 = article.peer_review_2.path;
		const path3 = article.peer_review_3.path;
		const path4 = article.peer_review_4.path;
		let scoringArticle;

		if (review_number == 1) {
			scoringArticle = await Article.findByIdAndUpdate(article_id, {
				peer_review_1: {
					path: path1,
					status: review,
				},
			});
		} else if (review_number == 2) {
			scoringArticle = await Article.findByIdAndUpdate(article_id, {
				peer_review_2: {
					path: path2,
					status: review,
				},
			});
		} else if (review_number == 3) {
			scoringArticle = await Article.findByIdAndUpdate(article_id, {
				peer_review_3: {
					path: path3,
					status: review,
				},
			});
		} else {
			scoringArticle = await Article.findByIdAndUpdate(article_id, {
				peer_review_4: {
					path: path4,
					status: review,
				},
			});
		}
		if (review == "Yes") {
			if (peer_review_score + 25 >= 50) {
				scoreUpdate = await Article.findByIdAndUpdate(article_id, {
					peer_review_score: peer_review_score + 25,
					status: "Peer Accepted",
				});
				const updateUser = await User.findByIdAndUpdate(article.submitted_by, {
					$inc: { total_peer_accepted: 1 },
				});
			} else {
				scoreUpdate = await Article.findByIdAndUpdate(article_id, {
					peer_review_score: peer_review_score + 25,
				});
			}
		}

		if (scoringArticle) {
			res.send({
				message: "Updated peer review score",
			});
		} else {
			res.send({
				message: "Unable to score",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route	GET /allArticlesPeerResponseVerification
//@descr	Get all articles eligible for peer response verification
//@access	Private

const allArticlesPeerResponseVerification = async (req, res) => {
	try {
		const journals = await Journal.find({
			$or: [{ author: req.rootuser._id }, { editors: req.rootuser._id }],
		});

		let journalIds = [];

		for (let i = 0; i < journals.length; i++) {
			journalIds.push(journals[i]._id);
		}

		const articles = await Article.find({
			journal: { $in: journalIds },
			status: "Under Peer Review",
		});
		if (articles) {
			res.send(articles);
		} else {
			res.send({
				message: "No articles found",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route	GET	/viewArticle
//@descr	Get an article by id
//@access	Public

const viewArticle = async (req, res) => {
	try {
		const { article_id } = req.params;
		console.log(article_id);
		const findArticle = await Article.findById(article_id);

		if (findArticle) {
			res.send(findArticle);
		} else {
			res.send({
				message: "No articles found",
			});
		}
	} catch (error) {
		console.log(error);
	}
};

//@route	GET /:article_id/peerReviewProof/:review_num
//@descr	Download peer review proof
//@access	Public

const peerReviewProof = async (req,res) => {
	try {
		const {article_id,review_num} = req.params;

		const findArticle = await Article.findById(article_id);
		let path;

		if(findArticle) {
			if(review_num == 1) {
				path = findArticle.peer_review_1.path;
			} else if(review_num == 2) {
				path = findArticle.peer_review_2.path;
			} else if(review_num == 3) {
				path = findArticle.peer_review_3.path;
			} else {
				path = findArticle.peer_review_4.path;
			}
			if(path) {
				res.download(path);
			} else {
				res.send({
					message: "Proof not found"
				});
			}
		} else {
			res.send({
				message: "Proof not found"
			});
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	addArticle,
	downloadArticle,
	withdrawArticle,
	referArticle,
	allArticlesForReferral,
	articleStatus,
	getNumberVolumes,
	volume,
	searchArticles,
	addPeerReviewDetails,
	scoreArticle,
	allArticlesPeerResponseVerification,
	viewArticle,
	peerReviewProof
};
