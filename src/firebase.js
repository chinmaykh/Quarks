// Import firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getAnalytics } from "firebase/analytics";

// My firebase creds
var firebaseConfig = {
  apiKey: "AIzaSyCHz4IbV1hPghJomm9OPibseRtVrHSo7AI",
  authDomain: "quarks-352714.firebaseapp.com",
  projectId: "quarks-352714",
  storageBucket: "quarks-352714.appspot.com",
  messagingSenderId: "216792595028",
  appId: "1:216792595028:web:8f2353eb31e64cb7f50bc1",
  measurementId: "G-W2VFBBV9JR",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// SDKs we gonna use
export const db = firebase.firestore();
export const auth = firebase.auth();
export const microsoftProvider = new firebase.auth.OAuthProvider(
  "microsoft.com"
);

// Also give google the stats
const analytics = getAnalytics(app);
