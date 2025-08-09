import User from '../models/User.js';

export const matchFingerprintToStudent = async (fingerprintHash) => {
  if (!fingerprintHash || fingerprintHash.length < 16) return null;

  return await User.findOne({
    $or: [
      { fingerprintHash: fingerprintHash },
      { fingerprintLeft: fingerprintHash },
      { fingerprintRight: fingerprintHash }
    ]
  });
};
