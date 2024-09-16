const mongoose = require("mongoose");

let Schema = mongoose.Schema;
const coinSchema = new Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coinName: { type: String, required: true, unique: true },
    ticker: { type: String, required: true },
    description: {type: String},
    token:{type: String},
    reserveOne: {type:Number, default: 1_000_000_000_000_000},
    reserveTwo: {type:Number, default: 30_000_000_000},
    url:{type: String, required: true},
    createdTime: {type: Date, default: new Date}
});

module.exports = mongoose.model("Coin", coinSchema);
