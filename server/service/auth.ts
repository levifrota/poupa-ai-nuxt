import * as admin from 'firebase-admin';

/**
 * Finds or creates a user in Firebase Authentication based on their phone number.
 * @param phoneNumber The user's phone number from WhatsApp.
 * @returns The user's UID.
 */
export const findOrCreateUserByPhone = async (phoneNumber: string): Promise<string> => {
  try {
    const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
    return userRecord.uid;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      // Create a new user if one doesn't exist
      const newUser = await admin.auth().createUser({
        phoneNumber: phoneNumber,
      });
      return newUser.uid;
    }
    throw error; // Re-throw other errors
  }
};