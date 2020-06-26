import * as mongoose from "mongoose"

export interface IUser extends mongoose.Document {
  name: string;
  userName: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema(
  {
    name: String,
    userName: {
      type: String,
      unique: true
    },
    password: String,
    role: {
      type: String,
      default: "regular"}
  }
);
export default mongoose.model('User', userSchema);