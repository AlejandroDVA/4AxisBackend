import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  activityDate: String,
  user: String,
  originAmount: String,
  convertionDate: String,
  coinValue: String,
  convertionAmount: String,
});

export default historySchema;