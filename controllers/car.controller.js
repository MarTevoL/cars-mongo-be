const mongoose = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;
    if (
      !make ||
      !model ||
      !release_date ||
      !transmission_type ||
      !size ||
      !style ||
      !price
    )
      throw new AppError(400, "Bad Request", "Create car Error");

    const car = await Car.create(req.body);
    sendResponse(res, 200, true, { car: car }, null, "Create Car Success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.getCars = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 10;
    const cars = await Car.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Car.countDocuments({ isDeleted: false });

    sendResponse(
      res,
      200,
      true,
      { cars: cars, page: page, total: Math.ceil(total / limit) },
      null,
      "Get Cars Success"
    );
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.editCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      throw new AppError(404, "Bad Request", "Invalid id");

    const updateCar = await Car.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!updateCar) throw new AppError(404, "Bad Request", "Car not found");

    sendResponse(
      res,
      200,
      true,
      { car: updateCar },
      null,
      "Update car Success"
    );
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      throw new AppError(404, "Bad Request", "Invalid id");

    const deleteCar = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deleteCar) throw new AppError(404, "Bab request", "Car not found");
    sendResponse(
      res,
      200,
      true,
      { car: deleteCar },
      null,
      "Delete car Success"
    );
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

module.exports = carController;
