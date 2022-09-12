const { getFirestore, collection } = require("firebase/firestore");
const { addDoc, getDoc, doc, deleteDoc } = require("firebase/firestore");

const app = require("./config");

// Initializing firestore db
const db = getFirestore(app);

// Secrets collection ref
const secretsRef = collection(db, "secrets");

// Saving secret
const saveSecret = async (data) => {
  try {
    const res = await addDoc(secretsRef, { data: data });
    return { success: true, data: { id: res.id } };
  } catch (err) {
    console.log(err);
    return { success: false, err };
  }
};

// Getting secret
const getSecret = async (id) => {
  try {
    const res = await getDoc(doc(db, "secrets", id));
    return { success: true, data: res.data() };
  } catch (err) {
    console.log(err);
    return { success: false, err };
  }
};

// Deleting secret
const deleteSecret = async (id) => {
  try {
    await deleteDoc(doc(db, "secrets", id));
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, err };
  }
};

module.exports = { saveSecret, getSecret, deleteSecret };
