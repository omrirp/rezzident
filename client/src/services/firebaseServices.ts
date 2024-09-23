import { ref, getMetadata, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage } from './firebaseConfig';
import { Asset } from '../models/asset'; // Adjust the import based on where your Asset type is defined
import { Account } from '../models/account';

/**
 * Calculate the total size of images stored in Firebase Storage from an array of assets.
 * @param assets: Asset[] - Array of assets, each containing an array of image URLs.
 * @returns Promise<number> - The total size of all images in MB.
 */
export const calculateTotalImageSizeInMB = async (assets: Asset[]): Promise<number> => {
  try {
    const imageUrls = assets.flatMap((asset) => asset.images);
    const sizePromises = imageUrls.map(async (url) => {
      const storageRef = ref(storage, url);
      const metadata = await getMetadata(storageRef);
      return metadata.size; // Size in bytes
    });

    const sizes = await Promise.all(sizePromises);
    const totalSizeInBytes = sizes.reduce((total, size) => total + size, 0);
    const totalSizeInMB = totalSizeInBytes / (1024 * 1024); // Convert bytes to MB
    return totalSizeInMB;
  } catch (error) {
    console.error('Error fetching image metadata:', error);
    return 0;
  }
};

/**
 * Handle avatar image replacement and update on Firebase storage
 * @param _id Account['_id'] - the account id is the root directory of the user in Firebase
 * @param currentAvatar - Account['avatar'] - the current avatar image to replace
 * @param newAvatar File - the new avatar image to replace with
 * @returns Promise<string> - the url of the avatar image
 */
export const updateAvatar = async (_id: Account['_id'], currentAvatar: Account['avatar'], newAvatar: File): Promise<string> => {
  // Delete the current avatar image if exists
  if (currentAvatar) {
    const avatarRef = ref(storage, currentAvatar);
    await deleteObject(avatarRef);
  }

  // Upload the new Avatar image
  if (newAvatar) {
    const path = `files/${_id}/avatar/${newAvatar.name}`;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytesResumable(storageRef, newAvatar);
    const avatarURL = await getDownloadURL(snapshot.ref);
    return avatarURL;
  }
  return '';
};
