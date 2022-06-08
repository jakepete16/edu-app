import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
 /*
const firebaseConfig = {
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  appId: "1:600507081671:web:acf828e427865ecb0c2fe2",
  authDomain: "boerigter-center-app.firebaseapp.com",
  databaseURL: "https://boerigter-center-app.firebaseio.com",
  messagingSenderId: "600507081671",
  projectId: "boerigter-center-app",
  storageBucket: "boerigter-center-app.appspot.com",
};
*/

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  appId: "1:843025938469:web:e77d97ffb5ec1949dfa7cc",
  authDomain: "education-department-app.firebaseapp.com",
  databaseURL: "https://boerigter-center-app.firebaseio.com",
  messagingSenderId: "843025938469",
  projectId: "education-department-app",
  storageBucket: "education-department-app.appspot.com",
};


firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();
