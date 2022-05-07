import { ethers } from 'ethers';

export const checkIfPrivKey = (str: string): boolean => {
  if (str.length === 64) {
    try {
      const wallet = new ethers.Wallet(str);
      if (wallet) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};
