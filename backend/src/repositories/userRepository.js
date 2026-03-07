const User = require("../models/User");

exports.create = (data) => User.create(data);

exports.findByEmail = (email) => User.findOne({ email });

exports.findById = (id) => User.findById(id).select("-password");

exports.findByRole = (role) =>
    User.find({ role }).select("-password");

exports.findAll = () => User.find().select("-password");
