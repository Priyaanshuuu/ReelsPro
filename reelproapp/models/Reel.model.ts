import mongoose, { Schema, models, model } from "mongoose";

const ReelSchema = new Schema(
  {
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments:[
      {
        user:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text:{
          type:String,
          required: true,
        },
        date:{
          type: Date,
          default: Date.now,
        },
      },
    ],
    shares:{
      type: Number,
      default:0,
    }
  },
  { timestamps: true }
);

const Reel = models.Reel || model("Reel", ReelSchema);
export default Reel;