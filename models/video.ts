import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoURL: string;
    thumbnailURL: string;
    controls?: boolean; // weather user have the access to controlls or not 
    transformation?: {
        height: number
        width: number;
        quality?: number
    };
    createdAt?: Date;
    updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoURL: { type: String, required: true },
    thumbnailURL: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
        height: { type: Number, default: VIDEO_DIMENSIONS.height },
        width: { type: Number, default: VIDEO_DIMENSIONS.width },
        quality: { type: Number, min: 1, max: 100 }
    },

},
    { timestamps: true }
)

const Video = models?.Video || model<IVideo>("User", videoSchema);
export default videoSchema;