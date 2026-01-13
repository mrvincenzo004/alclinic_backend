import mongoose from "mongoose";
const PatientSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    patientAddress: {
      type: String,
      default: null,
    },

    patientContactNumber: {
      type: String,
      required:true,
      trim:true,
    },

    // Self reference (connected persons)
    connectedPerson: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
  },
  {
    timestamps: true, // creates createdAt & updatedAt automatically
  }
);

export default mongoose.model("Patient", PatientSchema);
