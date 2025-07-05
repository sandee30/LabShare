import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCNor0s5jFJlObFxrew3um021CZjd3Hy0M",
  authDomain: "labshare-dec84.firebaseapp.com",
  projectId: "labshare-dec84",
  storageBucket: "labshare-dec84.firebasestorage.app",
  messagingSenderId: "591219022225",
  appId: "1:591219022225:web:e6bf8fa240a38607f86230"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };