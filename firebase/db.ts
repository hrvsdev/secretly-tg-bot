import { collection, doc, DocumentReference, getFirestore, setDoc } from "../deps.ts";
import app from "./config.ts";

// Initializing firestore db
const db = getFirestore(app);

// Secrets collection ref
const secretsRef = collection(db, "secrets");

// Getting doc
const getDocRef = () => doc(secretsRef);

// Saving secret
const saveSecret = async (data: string, doc: DocumentReference) => {
  try {
    await setDoc(doc, { data: data });
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, err };
  }
};

export { saveSecret, getDocRef };
