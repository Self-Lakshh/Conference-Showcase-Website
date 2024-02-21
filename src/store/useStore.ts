// useStore.ts - Global Zustand State Engine for ResearchSphere

import { create } from "zustand";
import { dbAdapter } from "../db/dbAdapter";
import type { Conference, Paper, Speaker, Sponsor, Community, Testimonial, News, Announcement, Album, Institution } from "../db/seedData";

interface AppState {
  // Collection States
  conferences: Conference[];
  papers: Paper[];
  speakers: Speaker[];
  institutions: Institution[];
  sponsors: Sponsor[];
  communities: Community[];
  testimonials: Testimonial[];
  newsList: News[];
  announcements: Announcement[];
  albums: Album[];
  domains: any[];
  
  // User/Auth States
  currentUser: any | null;
  registrations: any[];
  bookmarks: any[];
  notifications: any[];
  
  // Loading & Global States
  isInitialized: boolean;
  searchQuery: string;
  theme: "dark" | "light";

  // Actions
  initStore: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: "dark" | "light") => void;
  
  // Auth Actions
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;

  // CRUD Conference Actions
  addConference: (conf: Conference) => Promise<void>;
  updateConference: (id: string, data: Partial<Conference>) => Promise<void>;
  deleteConference: (id: string) => Promise<void>;

  // CRUD Paper Actions
  addPaper: (paper: Paper) => Promise<void>;
  updatePaper: (id: string, data: Partial<Paper>) => Promise<void>;
  deletePaper: (id: string) => Promise<void>;

  // CRUD Speaker Actions
  addSpeaker: (speaker: Speaker) => Promise<void>;
  updateSpeaker: (id: string, data: Partial<Speaker>) => Promise<void>;
  deleteSpeaker: (id: string) => Promise<void>;

  // Other CRUD Actions
  addAnnouncement: (ann: Announcement) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addNews: (news: News) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;

  // User Actions
  registerForConf: (confId: string) => Promise<void>;
  toggleBook: (type: "paper" | "conference" | "speaker", itemId: string) => Promise<boolean>;
  readNotification: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  conferences: [],
  papers: [],
  speakers: [],
  institutions: [],
  sponsors: [],
  communities: [],
  testimonials: [],
  newsList: [],
  announcements: [],
  albums: [],
  domains: [],
  
  currentUser: null,
  registrations: [],
  bookmarks: [],
  notifications: [],
  
  isInitialized: false,
  searchQuery: "",
  theme: "dark",

  initStore: async () => {
    if (get().isInitialized) return;
    
    const savedTheme = localStorage.getItem("conference_theme") as "dark" | "light" || "dark";
    set({ theme: savedTheme });
    
    try {
      const [
        confs,
        paps,
        spks,
        insts,
        spons,
        comms,
        tests,
        news,
        anns,
        albs,
        doms,
        user
      ] = await Promise.all([
        dbAdapter.getConferences(),
        dbAdapter.getPapers(),
        dbAdapter.getSpeakers(),
        dbAdapter.getInstitutions(),
        dbAdapter.getSponsors(),
        dbAdapter.getCommunities(),
        dbAdapter.getTestimonials(),
        dbAdapter.getNews(),
        dbAdapter.getAnnouncements(),
        dbAdapter.getAlbums(),
        dbAdapter.getDomains(),
        dbAdapter.getCurrentUser()
      ]);

      set({
        conferences: confs,
        papers: paps,
        speakers: spks,
        institutions: insts,
        sponsors: spons,
        communities: comms,
        testimonials: tests,
        newsList: news,
        announcements: anns,
        albums: albs,
        domains: doms,
        currentUser: user,
        isInitialized: true
      });

      if (user) {
        await get().refreshUserData();
      }
    } catch (error) {
      console.error("Error initializing Zustand store", error);
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem("conference_theme", theme);
  },

  login: async (email) => {
    const user = await dbAdapter.login(email);
    set({ currentUser: user });
    await get().refreshUserData();
  },

  logout: async () => {
    await dbAdapter.logout();
    set({ currentUser: null, registrations: [], bookmarks: [], notifications: [] });
  },

  refreshUserData: async () => {
    const user = get().currentUser;
    if (!user) return;
    
    const [regs, bmarks, notifs] = await Promise.all([
      dbAdapter.getRegistrations(user.id),
      dbAdapter.getBookmarks(user.id),
      dbAdapter.getNotifications(user.id)
    ]);
    
    set({
      registrations: regs,
      bookmarks: bmarks,
      notifications: notifs
    });
  },

  // --- CRUD CONFERENCES ---
  addConference: async (conf) => {
    const newConf = await dbAdapter.addDoc("conferences", conf);
    set(state => ({ conferences: [newConf, ...state.conferences] }));
  },

  updateConference: async (id, data) => {
    const updated = await dbAdapter.updateDoc("conferences", id, data);
    if (updated) {
      set(state => ({
        conferences: state.conferences.map(c => c.id === id ? { ...c, ...updated } : c)
      }));
    }
  },

  deleteConference: async (id) => {
    await dbAdapter.deleteDoc("conferences", id);
    set(state => ({
      conferences: state.conferences.filter(c => c.id !== id)
    }));
  },

  // --- CRUD PAPERS ---
  addPaper: async (paper) => {
    const newPaper = await dbAdapter.addDoc("papers", paper);
    set(state => ({ papers: [newPaper, ...state.papers] }));
  },

  updatePaper: async (id, data) => {
    const updated = await dbAdapter.updateDoc("papers", id, data);
    if (updated) {
      set(state => ({
        papers: state.papers.map(p => p.id === id ? { ...p, ...updated } : p)
      }));
    }
  },

  deletePaper: async (id) => {
    await dbAdapter.deleteDoc("papers", id);
    set(state => ({
      papers: state.papers.filter(p => p.id !== id)
    }));
  },

  // --- CRUD SPEAKERS ---
  addSpeaker: async (speaker) => {
    const newSpeaker = await dbAdapter.addDoc("speakers", speaker);
    set(state => ({ speakers: [newSpeaker, ...state.speakers] }));
  },

  updateSpeaker: async (id, data) => {
    const updated = await dbAdapter.updateDoc("speakers", id, data);
    if (updated) {
      set(state => ({
        speakers: state.speakers.map(s => s.id === id ? { ...s, ...updated } : s)
      }));
    }
  },

  deleteSpeaker: async (id) => {
    await dbAdapter.deleteDoc("speakers", id);
    set(state => ({
      speakers: state.speakers.filter(s => s.id !== id)
    }));
  },

  // --- ANNOUNCEMENTS ---
  addAnnouncement: async (ann) => {
    const newAnn = await dbAdapter.addDoc("announcements", ann);
    set(state => ({ announcements: [newAnn, ...state.announcements] }));
  },

  deleteAnnouncement: async (id) => {
    await dbAdapter.deleteDoc("announcements", id);
    set(state => ({ announcements: state.announcements.filter(a => a.id !== id) }));
  },

  // --- NEWS ---
  addNews: async (news) => {
    const newNews = await dbAdapter.addDoc("news", news);
    set(state => ({ newsList: [newNews, ...state.newsList] }));
  },

  deleteNews: async (id) => {
    await dbAdapter.deleteDoc("news", id);
    set(state => ({ newsList: state.newsList.filter(n => n.id !== id) }));
  },

  // --- USER INTERACTION ACTIONS ---
  registerForConf: async (confId) => {
    const user = get().currentUser;
    if (!user) return;
    
    // Check if already registered
    const exists = get().registrations.some(r => r.conferenceId === confId);
    if (exists) return;
    
    await dbAdapter.registerForConference(user.id, confId);
    await get().refreshUserData();

    // Create a local notification for user
    const confName = get().conferences.find(c => c.id === confId)?.title || "Conference";
    const code = `RS-${confId.toUpperCase().replace(/[^A-Z0-9]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      title: "Registration Confirmed!",
      message: `You are officially registered for ${confName}. Ticket Code: ${code}. Check the details in your dashboard.`,
      date: new Date().toISOString().split("T")[0],
      read: false
    };
    await dbAdapter.addDoc("notifications", newNotif);
    await get().refreshUserData();
  },

  toggleBook: async (type, itemId) => {
    const user = get().currentUser;
    if (!user) return false;
    
    const added = await dbAdapter.toggleBookmark(user.id, type, itemId);
    await get().refreshUserData();
    return added;
  },

  readNotification: async (id) => {
    await dbAdapter.markNotificationRead(id);
    await get().refreshUserData();
  }
}));
