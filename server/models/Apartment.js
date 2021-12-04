import mongoose from "mongoose";

const placeItems = [
  "apt",
  "university",
  "supermarket",
  "gas_station",
  "gym",
  "subway_station",
  "bus_station",
  "drugstore",
  "pharmacy",
  "convenience_store",
  "restaurant",
  "police",
  "park",
  "cafe",
  "bank",
];

let placeTypesScheme = {};

placeItems.forEach((type) => {
  const obj = {};
  obj[`${type}_name`] = { type: String, required: true };
  obj[`${type}_coordinates`] = { type: Array, required: type === "apt" };
  obj[`${type}_score`] = { type: Number, required: type === "apt" };
  placeTypesScheme = { ...placeTypesScheme, ...obj };
});

const ApartmentSchema = new mongoose.Schema({
  ...placeTypesScheme,
  apt_address: {
    type: String,
    requied: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SavedApartment", ApartmentSchema);
