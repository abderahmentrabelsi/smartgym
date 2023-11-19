import base64url from 'base64url';
import { isoUint8Array } from '@simplewebauthn/server/helpers';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import parser from 'ua-parser-js';
import User from '../../models/user.model.js';
import catchAsync from '../../utils/catchAsync.js';
import tokenService from '../../services/token.service.js';
import geolocateService from '../../services/geolocate.service.js';
export const rpID = process.env.RPID || 'localhost';
export const expectedOrigin = process.env.FRONT_URL || 'http://localhost:3000';

const strToUint8Array = (str) => {
  return Uint8Array.from(str.split(',').map((i) => parseInt(i, 10)));
};

const generateRegistrationOptionsResponse = catchAsync(async (req, res) => {
  // get user from db
  const { _id: id, devices, name } = req.user;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const options = generateRegistrationOptions({
    rpName: 'SmartGym',
    rpID,
    userID: id,
    userName: name,
    timeout: 3 * 60 * 1000,
    attestationType: 'none',
    excludeCredentials: devices.map((dev) => ({
      id: strToUint8Array(dev.credentialID),
      type: 'public-key',
      transports: dev.transports,
    })),
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      requireResidentKey: false,
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
    supportedAlgorithmIDs: [-7, -257],
  });
  req.session.currentChallenge = options.challenge;
  console.log(options);
  res.send(options);
});

const generateVerifyRegistrationResponse = catchAsync(async (req, res) => {
  const { body, user } = req;

  const expectedChallenge = req.session.currentChallenge;

  let verification;
  try {
    const opts = {
      response: body,
      expectedChallenge: `${expectedChallenge}`,
      expectedOrigin,
      expectedRPID: rpID,
      requireUserVerification: true,
    };
    verification = await verifyRegistrationResponse(opts);
  } catch (error) {
    const _error = error;
    console.error(_error);
    return res.status(400).send({ error: _error.message });
  }

  const { verified, registrationInfo } = verification;

  if (verified && registrationInfo) {
    const { credentialPublicKey, credentialID, counter } = registrationInfo;

    const existingDevice = user.devices.find((device) =>
      isoUint8Array.areEqual(strToUint8Array(device.credentialID), credentialID)
    );

    if (!existingDevice) {
      const { browser, device, os } = parser(req.headers['user-agent']);
      const { country, city } = await geolocateService.geoLocateRequest(req);
      const newDevice = {
        credentialPublicKey,
        credentialID,
        counter,
        transports: body.response.transports,
        deviceInfo: { browser, device, os },
        createdAt: Date.now(),
        location: `${city}, ${country}`,
      };
      user.devices.push(newDevice);
      await user.save();
    }
  }

  req.session.currentChallenge = undefined;

  res.send({ verified });
});

const generateAuthenticationOptionsResponse = catchAsync(async (req, res) => {
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).send({ error: 'User ID is required' });
  }
  const user = await User.findById(uid);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const allowedCreds = user.devices.map((dev) => ({
    // eslint-disable-next-line new-cap
    id: Uint8Array.from(dev.credentialID.split(',').map((i) => parseInt(i, 10))),
    type: 'public-key',
    transports: dev.transports,
  }));

  const options = generateAuthenticationOptions({
    timeout: 3 * 60 * 1000,
    allowCredentials: allowedCreds,
    userVerification: 'preferred',
    rpID,
  });
  req.session.currentChallenge = options.challenge;
  console.log(options);
  return res.send(options);
});

const generateVerifyAuthenticationResponse = catchAsync(async (req, res) => {
  const { body } = req;
  const { uid } = req.query;
  if (!uid) {
    return res.status(400).send({ error: 'User ID is required' });
  }
  const user = await User.findById(uid);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  let dbAuthenticator;
  const bodyCredIDBuffer = base64url.toBuffer(body.rawId);
  for (const dev of user.devices) {
    if (isoUint8Array.areEqual(strToUint8Array(dev.credentialID), bodyCredIDBuffer)) {
      dbAuthenticator = dev;
      break;
    }
  }

  if (!dbAuthenticator) {
    return res.status(400).send({ error: 'Authenticator is not registered with this site' });
  }

  const decodedAuthenticator = {
    credentialID: strToUint8Array(dbAuthenticator.credentialID),
    credentialPublicKey: strToUint8Array(dbAuthenticator.credentialPublicKey),
    transports: dbAuthenticator.transports,
  };

  try {
    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: req.session.currentChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: decodedAuthenticator,
      requireUserVerification: true,
    });
    console.log(verification);
    const { verified, authenticationInfo } = verification;
    if (verified) {
      dbAuthenticator.counter = authenticationInfo.newCounter;
      await user.save();
      const tokens = await tokenService.generateAuthTokens(user, false);
      res.send({ verified, tokens, user });
    } else {
      req.session.currentChallenge = undefined;
      res.send({ verified });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error });
  }
});

const getUserDevices = catchAsync(async (req, res) => {
  const { user } = req;
  const devices = user.devices.map((device) => ({
    id: device._id,
    deviceInfo: device.deviceInfo,
    location: device.location,
    createdAt: device.createdAt,
  }));
  res.send({ devices });
});

const removeDevice = catchAsync(async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const device = user.devices.id(id);
  if (!device) {
    return res.status(404).send({ error: 'Device not found' });
  } else {
    device.remove();
    await user.save();
    res.send({ message: 'Device removed' });
  }
});

const dropAllDevices = catchAsync(async (req, res) => {
  const { user } = req;
  user.devices = [];
  await user.save();
  res.send({ message: 'All devices removed' });
});

export default {
  generateRegistrationOptionsResponse,
  generateVerifyRegistrationResponse,
  generateAuthenticationOptionsResponse,
  generateVerifyAuthenticationResponse,
  getUserDevices,
  removeDevice,
  dropAllDevices,
};
