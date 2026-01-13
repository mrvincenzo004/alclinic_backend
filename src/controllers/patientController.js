import Patient from "../models/patient.js";


/**
 * ➕ Create Patient
 */
export const createPatient = async (req, res) => {
  try {
    const {
      patientName,
      patientAddress,
      patientContactNumber,
      connectedPerson,
    } = req.body;

    if (!patientName) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    const patient = await Patient.create({
      patientName,
      patientAddress,
      patientContactNumber,
      connectedPerson,
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 📄 Get All Patients
 */
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 📄 Get Single Patient
 */
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id).populate("connectedPerson");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ✏️ Update Patient
 */
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 🗑️ Delete Patient
 */
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByIdAndDelete(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * 🔍 Search Patient (name / contact number)
 */
export const searchPatient = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const patients = await Patient.find({
      $or: [
        { patientName: { $regex: search, $options: "i" } },
        { patientContactNumber: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
