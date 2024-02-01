import mongoose from "mongoose";
const id = new mongoose.Types.ObjectId();

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            //required: true
        },
        password: {
            type: String,
            // required: true,
            min: 5
        },
        wallets: [{
            name: {
                type: String,
                //unique: true,
                //required: true
            },
            balance: {
                type: Number,
                //required: true
            }

        }],
        transactions: [{
            type: {
                type: String,
                enum: ['expense', 'income'],
                //required: true
            },
            label: {
                type: String,
                //required: true
            },
            amount: {
                type: Number,
                //required: true
            },
            category: {
                type: String,
                //required: true
            },
            date: {
                type: Date,
                default: Date.now,
                //required: true
            },
        }],
    },
    { timestamps: true }
)

const User = mongoose.model("User", UserSchema)
export default User