import secp256k1 from 'secp256k1';

export const checkIfPrivKey = (str: string): boolean => {
  if (str.length === 64) {
    try {
      secp256k1.privateKeyVerify(Buffer.from(str, 'hex'));
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};
