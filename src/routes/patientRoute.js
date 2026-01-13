import express from "express";
import {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  searchPatient,
} from "../controllers/patientController.js";

const router = express.Router();

/**
 * 🔍 Search patient
 * Example: GET /patient/search?search=ram
 */
router.get("/search", searchPatient);

router.post("/", createPatient);
router.get("/", getAllPatients);
router.get("/:id", getPatientById);
router.patch("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;
