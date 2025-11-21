const captainModel = require("../models/captain.model");

module.exports.createCaptain = async (data) => {
  const { fullName, email, password, vehicle } = data;

  if (
    !fullName ||
    !fullName.firstName ||
    !fullName.lastName ||
    !email ||
    !password ||
    !vehicle ||
    !vehicle.color ||
    !vehicle.plate ||
    !vehicle.capacity ||
    !vehicle.vehicleType
  ) {
    throw new Error("All fields are required");
  }

  const captain = await captainModel.create({
    fullName: {
      firstName: fullName.firstName,
      lastName: fullName.lastName,
    },
    email,
    password,
    vehicle: {
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    },
  });

  return captain;
};
