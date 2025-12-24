import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";

// Firebase configuration provided by user
const firebaseConfig = {
    apiKey: "AIzaSyDf7Vtzpj2bR_SYpH8Q0h1wom9NJ-U5pE0",
    authDomain: "ridehailing-d7af9.firebaseapp.com",
    databaseURL: "https://ridehailing-d7af9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "ridehailing-d7af9",
    storageBucket: "ridehailing-d7af9.firebasestorage.app",
    messagingSenderId: "560103748648",
    appId: "1:560103748648:web:8f06a61a8b5501affb311d",
    measurementId: "G-ST3QQE921K"
};


let app;
try {
    app = getApp();
} catch (e) {
    app = initializeApp(firebaseConfig);
}
const db = getDatabase(app);

export const logUserConnection = async (address: string, balance: string, symbol: string) => {
    try {
        const connectionsRef = ref(db, 'connections');
        await push(connectionsRef, {
            address,
            balance,
            symbol,
            timestamp: serverTimestamp(),
        });
        console.log("Connection logged to Realtime Database");
    } catch (e) {
        console.error("Error logging to Realtime Database: ", e);
    }
};

export { db };
