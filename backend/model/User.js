import { Schema, model } from 'mongoose'

const UserSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  createdWorkshops: {
    type: [Schema.Types.ObjectId],
    ref: 'Workshop',
    default: [],
  },
  purchasedWorkshops: {
    type: [Schema.Types.ObjectId],
    ref: 'Workshop',
    default: [],
  },
  transactions: {
    type: [Schema.Types.ObjectId],
    ref: 'Transaction',
    default: [],
  },
  soulBalance: {
    type: Number,
    default: 0,
  },
  pyusdBalance: {
    type: Number,
    default: 0,
  },
})

const User = model('User', UserSchema)
export default User