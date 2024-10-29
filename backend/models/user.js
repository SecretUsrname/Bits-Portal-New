
import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        DOI: {
            type: [String],
            required: true,
            ref: 'Paper'
        },
        tagged_DOI: {
            type: [String],
            required: true,
            ref: 'Paper'
        }

    },

    {
        timeStamp: true
    }
);

const User = mongoose.model("User", UserSchema);

export default User;
