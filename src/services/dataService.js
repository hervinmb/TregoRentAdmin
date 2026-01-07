import { db, storage } from './firebase';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Generic function to upload an image
export const uploadImage = async (file, path) => {
  if (!file) return null;
  console.log(`Attempting to upload to: ${path}/${Date.now()}_${file.name}`);
  try {
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

// Generic function to upload multiple images
export const uploadImages = async (files, path) => {
  const uploadPromises = Array.from(files).map(file => uploadImage(file, path));
  return await Promise.all(uploadPromises);
};

// Apartments Services
export const addApartment = async (apartmentData, images) => {
  try {
    const imageUrls = await uploadImages(images, 'apartments');
    const docRef = await addDoc(collection(db, 'apartments'), {
      ...apartmentData,
      images: imageUrls,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding apartment: ", error);
    throw error;
  }
};

export const getApartments = async () => {
  try {
    const q = query(collection(db, 'apartments'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting apartments: ", error);
    throw error;
  }
};

// Cars Services
export const addCar = async (carData, images) => {
  try {
    const imageUrls = await uploadImages(images, 'cars');
    const docRef = await addDoc(collection(db, 'cars'), {
      ...carData,
      images: imageUrls,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding car: ", error);
    throw error;
  }
};

export const getCars = async () => {
  try {
    const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting cars: ", error);
    throw error;
  }
};
