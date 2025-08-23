import { Router } from 'express';
import { auth } from '../../middleware/auth';
import { USER_ROLE } from '../../constant';
import fileUpload from '../../utils/uploadImage';
import parseFormData from '../../middleware/parsedData';
import validateRequest from '../../middleware/validation';
import { LoanApplicationValidation } from './loanApplication.validation';
import { LoanApplicationController } from './loanApplication.controller';

const upload = fileUpload('./public/uploads/images/');

const router = Router();

router.post(
    '/create',
    auth(USER_ROLE.fieldOfficer),
    upload.single('image'),
    parseFormData,
    validateRequest(LoanApplicationValidation.createLoanApplicationSchema),
    LoanApplicationController.createLoanApplication
).get("/all_loan_application", auth(USER_ROLE.fieldOfficer), LoanApplicationController.getAllLoanApplication)

export const LoanApplicationRoutes = router;
