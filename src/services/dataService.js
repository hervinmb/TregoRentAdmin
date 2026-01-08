import { db, storage } from './firebase';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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

export const updateApartment = async (id, apartmentData, newImages = []) => {
  try {
    let imageUrls = apartmentData.images || [];
    if (newImages.length > 0) {
      const newImageUrls = await uploadImages(newImages, 'apartments');
      imageUrls = [...imageUrls, ...newImageUrls];
    }
    
    const apartmentRef = doc(db, 'apartments', id);
    await updateDoc(apartmentRef, {
      ...apartmentData,
      images: imageUrls,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating apartment: ", error);
    throw error;
  }
};

export const deleteApartment = async (id) => {
  try {
    await deleteDoc(doc(db, 'apartments', id));
  } catch (error) {
    console.error("Error deleting apartment: ", error);
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

export const updateCar = async (id, carData, newImages = []) => {
  try {
    let imageUrls = carData.images || [];
    if (newImages.length > 0) {
      const newImageUrls = await uploadImages(newImages, 'cars');
      imageUrls = [...imageUrls, ...newImageUrls];
    }
    
    const carRef = doc(db, 'cars', id);
    await updateDoc(carRef, {
      ...carData,
      images: imageUrls,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating car: ", error);
    throw error;
  }
};

export const deleteCar = async (id) => {
  try {
    await deleteDoc(doc(db, 'cars', id));
  } catch (error) {
    console.error("Error deleting car: ", error);
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

// Reservations Services
export const getReservations = async () => {
  try {
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting reservations: ", error);
    throw error;
  }
};

export const updateReservationStatus = async (id, status) => {
  try {
    const reservationRef = doc(db, 'reservations', id);
    await updateDoc(reservationRef, {
      status: status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating reservation status: ", error);
    throw error;
  }
};

