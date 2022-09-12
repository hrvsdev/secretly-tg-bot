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

// Getting secret
const getSecret = async (id) => {
  try {
    const res = await getDoc(doc(secretsRef, id));
    return { success: true, data: res.data() };
  } catch (err) {
    console.log(err);
    return { success: false, err };
  }
};

// Deleting secret
const deleteSecret = async (id) => {
  try {
    await deleteDoc(doc(secretsRef, id));
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, err };
  }
};

module.exports = { saveSecret, getSecret, deleteSecret, getDocRef };
