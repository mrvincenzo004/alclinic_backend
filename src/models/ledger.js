import mongoose from "mongoose";
import { getNepaliDate } from "../utils/date.js";
const LedgerSchema = new mongoose.Schema(
  {
    // Reference to Patient
    patientData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    // Array of raw objects [{}, {}]
    medicineDetails: {
      type: [
        {
          type: Object, // flexible structure
          required:true,
        },
      ],
      default: [],
    },

    description: {
      type: String,
      default: null,
      trim: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // ✅ Ledger payment status
    ledgerStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
      required: true,
    },
    nepaliDate:{
        type:String,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);


LedgerSchema.pre("save", function () {
  this.nepaliDate ||= getNepaliDate(new Date());
});


export default mongoose.model("Ledger", LedgerSchema);
