import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        coupleName: { type: String, required: true },
        location: { type: String, trim: true },
        thumbnail: { type: String }, // URL or Base64
        shortDescription: { type: String, required: true, maxlength: 200 },
        fullDescription: { type: String },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        displayOrder: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        }
    },
    { timestamps: true }
);

// Index for sorting by display order
testimonialSchema.index({ displayOrder: 1 });

export default mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
