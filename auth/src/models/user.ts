import mongoose from 'mongoose'
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

type User = mongoose.InferSchemaType<typeof userSchema>

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.get("password"), 10)

        this.set("password", hashedPassword);
    }
    done();
});

export default mongoose.model<User>('user', userSchema)