import  { Schema, models, model } from "mongoose";

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // recipient
    type: { type: String, enum: ["like", "comment"], required: true },
    reel: { type: Schema.Types.ObjectId, ref: "Reel", required: true },
    from: { type: Schema.Types.ObjectId, ref: "User", required: true }, // who did the action
    comment: { type: String }, // only for comment notifications
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Notification || model("Notification", NotificationSchema);