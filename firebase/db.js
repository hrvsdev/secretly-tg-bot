const { getFirestore, collection } = require("firebase/firestore");
const { setDoc, getDoc, doc, deleteDoc } = require("firebase/firestore");

const app = require("./config");

// Initializing firestore db
const db = getFirestore(app);

// Secrets collection ref
const secretsRef = collection(db, "secrets");

// Getting doc
const getDocRef = () => doc(secretsRef);

// Saving secret
const saveSecret = async (data, doc) => {
  try {
    await setDoc(doc, { data: data });
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, err };
  }
};

module.exports = { saveSecret, getDocRef };
