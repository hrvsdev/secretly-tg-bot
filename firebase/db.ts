import { collection, doc, getFirestore, setDoc } from "../deps.ts";
import app from "./config.ts";

// Initializing firestore db
const db = getFirestore(app);

// Secrets collection ref
const secretsRef = collection(db, "secrets");

// Getting doc
const getDocId = (): string => doc(secretsRef).id;

// Saving secret
const saveSecret = async (data: string, docId: string) => {
  try {
    await setDoc(doc(secretsRef, docId), { data: data });
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, err };
  }
};

export { saveSecret, getDocId };
