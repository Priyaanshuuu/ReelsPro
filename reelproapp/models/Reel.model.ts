import   { Schema, models, model } from "mongoose";

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
      type: [String],
      ref: "User",
      required: true,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Reel = models.Reel || model("Reel", ReelSchema);
export default Reel;