import express from 'express';
import webauthnController from '../../controllers/auth/webauthn.controller.js';
import auth from '../../middlewares/auth.js';

const webauthnRouter = express.Router();

webauthnRouter.get('/generate-registration-options', auth(), webauthnController.generateRegistrationOptionsResponse);
webauthnRouter.post('/verify-registration', auth(), webauthnController.generateVerifyRegistrationResponse);
webauthnRouter.get('/generate-authentication-options', webauthnController.generateAuthenticationOptionsResponse);
webauthnRouter.post('/verify-authentication', webauthnController.generateVerifyAuthenticationResponse);
webauthnRouter.get('/devices', auth(), webauthnController.getUserDevices);
webauthnRouter.delete('/devices/:id', auth(), webauthnController.removeDevice);
webauthnRouter.post('/devices/drop-all', auth(), webauthnController.dropAllDevices);
export default webauthnRouter;
