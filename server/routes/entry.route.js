import express from 'express';
import EntryController from '../controllers/entryController';
import { entryValidation } from '../middlewares/entryValidation';
import { verifyAuth } from '../middlewares/auth';

const router = express.Router();


router.post('/entries', verifyAuth, entryValidation, EntryController.createEntry);
router.patch('/entries/:entryId', verifyAuth, entryValidation, EntryController.modifyEntry);
router.get('/entries', verifyAuth, EntryController.getAllentries);
router.get('/entries/:entryId', verifyAuth, EntryController.getSpecificEntry);
router.delete('/entries/:entryId', verifyAuth, EntryController.deleteEntry);


export default router;
