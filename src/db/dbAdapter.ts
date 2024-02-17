// dbAdapter.ts - Unified Firebase & LocalStorage Database Adapter

import { generateSeedData } from "./seedData";
import type { Conference, Paper, Speaker, Sponsor, Community, Testimonial, News, Announcement, Album, Institution } from "./seedData";
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// -------------------------------------------------------------
// FIREBASE CONFIGURATION DETECTION
// -------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== "YOUR_API_KEY"
);

let firebaseApp;
let firestore: any = null;
let auth: any = null;

if (isFirebaseConfigured) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firestore = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    console.log("Conference Website: Connected to Firebase services successfully.");
  } catch (error) {
    console.error("Conference Website: Firebase initialization failed. Falling back to local storage engine.", error);
  }
} else {
  console.log("Conference Website: No Firebase keys detected. Running in LocalStorage Database mode.");
}

// -------------------------------------------------------------
// LOCAL STATE STORAGE ENGINE
// -------------------------------------------------------------
const STORAGE_PREFIX = "researchsphere_db_";

const getLocal = (key: string): any => {
  const data = localStorage.getItem(STORAGE_PREFIX + key);
  return data ? JSON.parse(data) : null;
};

const setLocal = (key: string, value: any) => {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
};

// Initialize local DB if empty
export const initLocalDatabase = () => {
  if (!getLocal("initialized")) {
    console.log("Conference Website: Seeding local browser database...");
    const seed = generateSeedData();
    setLocal("domains", seed.domains);
    setLocal("institutions", seed.institutions);
    setLocal("speakers", seed.speakers);
    setLocal("sponsors", seed.sponsors);
    setLocal("communities", seed.communities);
    setLocal("testimonials", seed.testimonials);
    setLocal("news", seed.news);
    setLocal("conferences", seed.conferences);
    setLocal("papers", seed.papers);
    setLocal("announcements", seed.announcements);
    setLocal("albums", seed.albums);
    
    // User storage
    setLocal("users", [
      {
        id: "admin-user",
        email: "admin@conferencewebsite.org",
        name: "Admin Specialist",
        role: "admin",
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg"
      },
      {
        id: "user-1",
        email: "researcher@mit.edu",
        name: "Dr. Elena Rostova",
        role: "user",
        avatar: "https://randomuser.me/api/portraits/women/45.jpg"
      }
    ]);
    
    // User specific collections
    setLocal("registrations", [
      {
        id: "reg-1",
        userId: "user-1",
        conferenceId: "conf-1",
        ticketCode: "RS-CONF1-8849",
        registerDate: "2024-02-15"
      }
    ]);
    setLocal("bookmarks", [
      { id: "bmark-1", userId: "user-1", type: "paper", itemId: "paper-0" },
      { id: "bmark-2", userId: "user-1", type: "conference", itemId: "conf-2" }
    ]);
    setLocal("notifications", [
      {
        id: "notif-1",
        userId: "user-1",
        title: "Paper Submission Accepted",
        message: "Your paper on Superconducting Quantum Qubits has been accepted for Conference RS-101.",
        date: "2024-02-16",
        read: false
      }
    ]);
    setLocal("settings", {
      siteName: "Conference Website",
      theme: "dark",
      maintenanceMode: false
    });
    
    setLocal("initialized", true);
    console.log("Conference Website: Seeding completed successfully. Local storage loaded.");
  } else {
    // Perform legacy logo migrations if already initialized
    const collections = ["institutions", "speakers", "sponsors", "conferences"];
    collections.forEach(colName => {
      const list = getLocal(colName);
      if (list && Array.isArray(list)) {
        let migrated = false;
        const updated = list.map((item: any) => {
          if (item.logo && typeof item.logo === "string" && item.logo.includes("logo.clearbit.com")) {
            item.logo = item.logo.replace("logo.clearbit.com", "logos.hunter.io");
            migrated = true;
          }
          if (item.avatar && typeof item.avatar === "string" && item.avatar.includes("logo.clearbit.com")) {
            item.avatar = item.avatar.replace("logo.clearbit.com", "logos.hunter.io");
            migrated = true;
          }
          return item;
        });
        if (migrated) {
          setLocal(colName, updated);
        }
      }
    });
  }
};

// Always run initialization check
initLocalDatabase();

// -------------------------------------------------------------
// ADAPTER IMPLEMENTATION
// -------------------------------------------------------------
export const dbAdapter = {
  isFirebase: () => isFirebaseConfigured && !!firestore,

  // --- COLLECTION GETTERS ---
  async getCollection(collectionName: string): Promise<any[]> {
    if (this.isFirebase()) {
      try {
        const snap = await getDocs(collection(firestore, collectionName));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error(`Firebase error reading ${collectionName}. Falling back to Local.`, err);
        return getLocal(collectionName) || [];
      }
    }
    return getLocal(collectionName) || [];
  },

  async getDocById(collectionName: string, id: string): Promise<any | null> {
    if (this.isFirebase()) {
      try {
        const snap = await getDoc(doc(firestore, collectionName, id));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
      } catch (err) {
        console.error(`Firebase error reading doc ${id} in ${collectionName}. Falling back to Local.`, err);
        const list = getLocal(collectionName) || [];
        return list.find((item: any) => item.id === id) || null;
      }
    }
    const list = getLocal(collectionName) || [];
    return list.find((item: any) => item.id === id) || null;
  },

  async addDoc(collectionName: string, item: any): Promise<any> {
    const newId = item.id || `${collectionName.slice(0, 3)}-${Date.now()}`;
    const fullItem = { ...item, id: newId };
    
    if (this.isFirebase()) {
      try {
        await setDoc(doc(firestore, collectionName, newId), fullItem);
        return fullItem;
      } catch (err) {
        console.error(`Firebase error adding doc in ${collectionName}. Falling back to Local.`, err);
      }
    }
    const list = getLocal(collectionName) || [];
    list.unshift(fullItem);
    setLocal(collectionName, list);
    return fullItem;
  },

  async updateDoc(collectionName: string, id: string, data: any): Promise<any> {
    if (this.isFirebase()) {
      try {
        await updateDoc(doc(firestore, collectionName, id), data);
        const updatedDoc = await this.getDocById(collectionName, id);
        return updatedDoc;
      } catch (err) {
        console.error(`Firebase error updating doc in ${collectionName}. Falling back to Local.`, err);
      }
    }
    const list = getLocal(collectionName) || [];
    const index = list.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      setLocal(collectionName, list);
      return list[index];
    }
    return null;
  },

  async deleteDoc(collectionName: string, id: string): Promise<boolean> {
    if (this.isFirebase()) {
      try {
        await deleteDoc(doc(firestore, collectionName, id));
        return true;
      } catch (err) {
        console.error(`Firebase error deleting doc in ${collectionName}. Falling back to Local.`, err);
      }
    }
    const list = getLocal(collectionName) || [];
    const filtered = list.filter((item: any) => item.id !== id);
    setLocal(collectionName, filtered);
    return true;
  },

  // --- SPECIALIZED DOMAIN FUNCTIONS ---
  async getConferences(): Promise<Conference[]> {
    return this.getCollection("conferences");
  },

  async getConferenceById(id: string): Promise<Conference | null> {
    return this.getDocById("conferences", id);
  },

  async getPapers(): Promise<Paper[]> {
    return this.getCollection("papers");
  },

  async getPaperById(id: string): Promise<Paper | null> {
    return this.getDocById("papers", id);
  },

  async getSpeakers(): Promise<Speaker[]> {
    return this.getCollection("speakers");
  },

  async getSpeakerById(id: string): Promise<Speaker | null> {
    return this.getDocById("speakers", id);
  },

  async getInstitutions(): Promise<Institution[]> {
    return this.getCollection("institutions");
  },

  async getSponsors(): Promise<Sponsor[]> {
    return this.getCollection("sponsors");
  },

  async getCommunities(): Promise<Community[]> {
    return this.getCollection("communities");
  },

  async getNews(): Promise<News[]> {
    return this.getCollection("news");
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return this.getCollection("testimonials");
  },

  async getAnnouncements(): Promise<Announcement[]> {
    return this.getCollection("announcements");
  },

  async getAlbums(): Promise<Album[]> {
    return this.getCollection("albums");
  },

  async getDomains() {
    return getLocal("domains") || DOMAINS_FALLBACK;
  },

  // --- REGISTRATIONS ---
  async getRegistrations(userId: string): Promise<any[]> {
    if (this.isFirebase()) {
      try {
        const qSnap = await getDocs(query(collection(firestore, "registrations"), where("userId", "==", userId)));
        return qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error("Firebase registrations error", err);
      }
    }
    const regs = getLocal("registrations") || [];
    return regs.filter((r: any) => r.userId === userId);
  },

  async registerForConference(userId: string, conferenceId: string): Promise<any> {
    const code = `RS-${conferenceId.toUpperCase().replace(/[^A-Z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReg = {
      id: `reg-${Date.now()}`,
      userId,
      conferenceId,
      ticketCode: code,
      registerDate: new Date().toISOString().split("T")[0]
    };
    return this.addDoc("registrations", newReg);
  },

  // --- BOOKMARKS ---
  async getBookmarks(userId: string): Promise<any[]> {
    if (this.isFirebase()) {
      try {
        const qSnap = await getDocs(query(collection(firestore, "bookmarks"), where("userId", "==", userId)));
        return qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.error("Firebase bookmarks error", err);
      }
    }
    const bmarks = getLocal("bookmarks") || [];
    return bmarks.filter((b: any) => b.userId === userId);
  },

  async toggleBookmark(userId: string, type: "paper" | "conference" | "speaker", itemId: string): Promise<boolean> {
    const bmarks = getLocal("bookmarks") || [];
    const idx = bmarks.findIndex((b: any) => b.userId === userId && b.type === type && b.itemId === itemId);
    if (idx !== -1) {
      bmarks.splice(idx, 1);
      setLocal("bookmarks", bmarks);
      if (this.isFirebase()) {
        try {
          const qSnap = await getDocs(query(
            collection(firestore, "bookmarks"), 
            where("userId", "==", userId),
            where("type", "==", type),
            where("itemId", "==", itemId)
          ));
          for (const docSnapshot of qSnap.docs) {
            await deleteDoc(doc(firestore, "bookmarks", docSnapshot.id));
          }
        } catch (err) {
          console.error("Firebase delete bookmark error", err);
        }
      }
      return false; // removed
    } else {
      const newBmark = { id: `bmark-${Date.now()}`, userId, type, itemId };
      bmarks.push(newBmark);
      setLocal("bookmarks", bmarks);
      if (this.isFirebase()) {
        try {
          await setDoc(doc(firestore, "bookmarks", newBmark.id), newBmark);
        } catch (err) {
          console.error("Firebase add bookmark error", err);
        }
      }
      return true; // added
    }
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId: string): Promise<any[]> {
    const list = await this.getCollection("notifications");
    return list.filter((n: any) => n.userId === userId);
  },

  async markNotificationRead(id: string): Promise<void> {
    await this.updateDoc("notifications", id, { read: true });
  },

  // --- AUTHENTICATION MOCKS & INTEGRATIONS ---
  async login(email: string): Promise<any> {
    // If real Firebase Auth is configured
    if (this.isFirebase() && auth) {
      // In production, we'd sign in with password, but for showcase we do a quick account selection
      // Fallback or local login is easier for demo users.
    }
    const users = getLocal("users") || [];
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setLocal("currentUser", user);
      return user;
    }
    // Create new demo user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      role: "user",
      avatar: `https://randomuser.me/api/portraits/lego/${Math.floor(Math.random() * 8) + 1}.jpg`
    };
    users.push(newUser);
    setLocal("users", users);
    setLocal("currentUser", newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_PREFIX + "currentUser");
  },

  async getCurrentUser(): Promise<any | null> {
    return getLocal("currentUser") || (getLocal("users") ? getLocal("users")[1] : null); // Default to Elena
  }
};

const DOMAINS_FALLBACK = [
  { id: "ai", name: "Artificial Intelligence & ML", icon: "Brain", color: "from-cyan-500 to-blue-500" },
  { id: "quantum", name: "Quantum Computing", icon: "Cpu", color: "from-purple-500 to-indigo-500" }
];
