import express from 'express';
import { 
    createLedger,
    updateLedgerStatus,
    updateLedger,
    deleteLedger,
    searchLedger,
    markPatientLedgersPaid,
    fetchLedgers,
    getLedgerById,

 } from '../controllers/ledgerController.js';


 const router=express.Router();
 router.post('/',createLedger);
 router.get('/',fetchLedgers);
 router.get('/details/:id',getLedgerById);
 router.patch('/:id/status',updateLedgerStatus);
 router.patch("/:id",updateLedger);
 router.delete("/:id",deleteLedger);
 router.get('/search',searchLedger);
 router.patch('/mark-paid',markPatientLedgersPaid);

 export default router;
