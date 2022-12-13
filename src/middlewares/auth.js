const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const { User } = require("../models/user");

const isLoggedIn = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
		token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, jwtSecret);

		req.rootuser = await User.findById(decoded._id).select("-password");
		next();
		} catch (error) {
			console.error(error);
			return res.status(401).send({
				message: "Unauthorized",
			});
		}
	}

	if (!token) {
		return res.status(401).send({
		message: "Unauthorized",
		});
	}
};

const isAdmin = async (req,res,next) => {
	let token,admin;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
		token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, jwtSecret);

		req.rootuser = await User.findById(decoded._id).select("-password");
		
		if(req.rootuser.userRole != "Admin") {
			return res.status(401).send({
				message: "Unauthorized",
			});
		}
		next();
		} catch (error) {
			console.error(error);
			return res.status(401).send({
				message: "Unauthorized",
			});
		}
	}

	if (!token) {
		return res.status(401).send({
		message: "Unauthorized",
		});
	}
}

module.exports = { isLoggedIn, isAdmin };
