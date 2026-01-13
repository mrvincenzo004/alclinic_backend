import Ledger from "../models/ledger.js";
import Patient from "../models/patient.js";
/**
 * ✅ Create Ledger
 */

export const createLedger = async (req, res) => {
  try {
    const {
      patientData, // { patientName, patientContactNumber, patientAddress?, connectedPerson? }
      medicineDetails,
      description,
      totalPrice,
      ledgerStatus, // optional
    } = req.body || {};

    // Validate required fields
    if (
      !patientData ||
      !patientData.patientName ||
      !patientData.patientContactNumber ||
      totalPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // 1️⃣ Check if patient already exists
    let patient = await Patient.findOne({
      patientName: patientData.patientName,
      patientContactNumber: patientData.patientContactNumber,
    });

    // 2️⃣ If patient doesn't exist, create new
    if (!patient) {
      patient = await Patient.create({
        patientName: patientData.patientName,
        patientContactNumber: patientData.patientContactNumber,
        patientAddress: patientData.patientAddress || null,
        connectedPerson: patientData.connectedPerson || [],
      });
    }

    // 3️⃣ Create Ledger
    const ledger = await Ledger.create({
      patientData: patient._id,
      medicineDetails,
      description,
      totalPrice,
      ledgerStatus: ledgerStatus || "unpaid",
    });

    res.status(201).json({
      success: true,
      message: "Ledger created successfully",
      data: ledger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const fetchLedgers = async (req, res) => {
  try {
    console.log("fetch ledger hitted...");    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 1️⃣ Fetch ledgers (newest → oldest)
    const ledgers = await Ledger.find()
      .populate("patientData") // populate patient info
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    // 2️⃣ Count total ledgers
    const totalLedgers = await Ledger.countDocuments();

    res.status(200).json({
      success: true,
      message: "Ledgers fetched successfully",
      meta: {
        total: totalLedgers,
        page,
        limit,
        totalPages: Math.ceil(totalLedgers / limit),
      },
      data: ledgers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ Update Ledger Status (paid / unpaid)
 */
export const updateLedgerStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { ledgerStatus } = req.body;
    console.log("update ledger status triggred..",ledgerStatus);

    if (!["paid", "unpaid"].includes(ledgerStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ledger status",
      });
    }

    const ledger = await Ledger.findByIdAndUpdate(
      id,
      { ledgerStatus },
      { new: true }
    );

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }

    res.json({
      success: true,
      message: "Ledger status updated",
      data: ledger,
    });
  } catch (error) {
    console.log("error while creating ledger: ",error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ Update Ledger (general update)
 */
export const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const ledger = await Ledger.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }

    res.json({
      success: true,
      message: "Ledger updated successfully",
      data: ledger,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✅ Delete Ledger
 */
export const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const ledger = await Ledger.findByIdAndDelete(id);

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Ledger deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const searchLedger = async (req, res) => {
  try {

    const { search } = req.query;
    console.log("search ledger hitted..",search);
    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const ledgers = await Ledger.aggregate([
      // Join patient collection
      {
        $lookup: {
          from: "patients", // MongoDB collection name
          localField: "patientData",
          foreignField: "_id",
          as: "patientData",
        },
      },

      // Convert array to object
      {
        $unwind: "$patientData",
      },

      // Search by name OR contact number
      {
        $match: {
          $or: [
            {
              "patientData.patientName": {
                $regex: search,
                $options: "i", // case-insensitive
              },
            },
            {
              "patientData.patientContactNumber": {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      },

      // Optional: sort latest first
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: ledgers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const markPatientLedgersPaid = async (req, res) => {
  try {
    const { patientName, patientContactNumber } = req.body || {};

    // 1️⃣ Validate input
    if (!patientName || !patientContactNumber) {
      return res.status(400).json({
        success: false,
        message: "patientName and patientContactNumber are required",
      });
    }

    // 2️⃣ Find the patient
    const patient = await Patient.findOne({
      patientName,
      patientContactNumber,
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // 3️⃣ Update all ledgers of this patient
    const result = await Ledger.updateMany(
      { patientData: patient._id, ledgerStatus: { $ne: "paid" } }, // only unpaid ledgers
      { $set: { ledgerStatus: "paid" } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} ledger(s) marked as paid`,
      patient: {
        _id: patient._id,
        patientName: patient.patientName,
        patientContactNumber: patient.patientContactNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLedgerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Ledger ID is required",
      });
    }

    // Fetch ledger with populated patient data
    const ledger = await Ledger.findById(id)
      .populate("patientData") // populate patient reference
      .sort({ createdAt: -1 });

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ledger fetched successfully",
      data: ledger,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

