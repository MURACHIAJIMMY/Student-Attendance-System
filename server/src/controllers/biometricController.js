import { matchFingerprintToStudent } from '../utils/fingerprintUtils.js';

export const verifyFingerprint = async (req, res) => {
  try {
    const { fingerprintHash } = req.body;

    if (!fingerprintHash || fingerprintHash.length < 16) {
      return res.status(400).json({ error: 'Invalid fingerprint hash.' });
    }

    const student = await matchFingerprintToStudent(fingerprintHash);

    if (!student) {
      return res.status(404).json({ error: 'No match found for this fingerprint.' });
    }

    res.status(200).json({
      message: 'Fingerprint matched',
      student: {
        _id: student._id,
        name: student.name,
        admNo: student.admNo,
        className: student.className
      }
    });
  } catch (err) {
    console.error('[verifyFingerprint]', err);
    res.status(500).json({ error: 'Fingerprint verification failed.' });
  }
};
