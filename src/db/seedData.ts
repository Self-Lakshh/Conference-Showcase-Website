// seedData.ts - Procedural Data Generation Engine for ResearchSphere

export interface Institution {
  id: string;
  name: string;
  logo: string;
  location: string;
  type: "University" | "Innovation Lab" | "Research Institute" | "Tech Enterprise";
  country: string;
  website: string;
}

export interface Speaker {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  title: string;
  institutionId: string;
  researchInterests: string[];
  publicationCount: number;
  talkCount: number;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    scholar?: string;
  };
  videoUrl?: string;
  timeline: { year: number; event: string }[];
  talkHistory: { title: string; event: string; year: number }[];
}

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  speakerIds: string[];
  room: string;
  track: string;
}

export interface Conference {
  id: string;
  title: string;
  logo: string;
  coverImage: string;
  description: string;
  startDate: string;
  endDate: string;
  venue: string;
  location: string;
  coordinates: { lat: number; lng: number };
  registrationFee: number;
  registrationStatus: "Open" | "Closed" | "Selling Fast";
  status: "Upcoming" | "Ongoing" | "Past";
  tracks: string[];
  sessions: Session[];
  speakerIds: string[];
  sponsorIds: string[];
  paperIds: string[];
  resources: { name: string; size: string; url: string; type: string }[];
  faqs: { question: string; answer: string }[];
}

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authorIds: string[];
  institutionIds: string[];
  citationsCount: number;
  downloadUrl: string;
  publishDate: string;
  topics: string[];
  conferenceId?: string;
  citations: string[]; // Linked paper IDs
  readingTime: number; // in minutes
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: "Diamond" | "Gold" | "Silver";
  website: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  logo: string;
  fields: string[];
  eventsCount: number;
}

export interface Testimonial {
  id: string;
  user: string;
  title: string;
  role: string;
  comment: string;
  avatar: string;
  rating: number;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  publishDate: string;
  readTime: number;
  tags: string[];
}

export interface Announcement {
  id: string;
  conferenceId: string;
  title: string;
  content: string;
  date: string;
  type: "info" | "warning" | "success";
}

export interface Album {
  id: string;
  conferenceId: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[]; // List of image URLs
}

// -------------------------------------------------------------
// CORE STATIC BASES FOR PROCEDURAL GENERATION
// -------------------------------------------------------------

const DOMAINS = [
  { id: "ai", name: "Artificial Intelligence & ML", icon: "Brain", color: "from-cyan-500 to-blue-500", desc: "Neural architectures, deep learning, NLP, computer vision, and cognitive systems." },
  { id: "quantum", name: "Quantum Computing & Physics", icon: "Cpu", color: "from-purple-500 to-indigo-500", desc: "Superconducting qubits, quantum algorithms, cryptography, and quantum teleportation." },
  { id: "bio", name: "Bioinformatics & Genomics", icon: "Dna", color: "from-emerald-500 to-teal-500", desc: "CRISPR analytics, computational protein design, sequence alignment, and cellular modeling." },
  { id: "astro", name: "Astrophysics & Space Discovery", icon: "Globe", color: "from-orange-500 to-red-500", desc: "Dark energy, cosmic microwave background, exoplanet imaging, and stellar evolution." },
  { id: "cyber", name: "Cybersecurity & Cryptography", icon: "Shield", color: "from-red-500 to-pink-500", desc: "Zero-knowledge proofs, post-quantum encryption, web3 protocols, and threat intelligence." },
  { id: "climate", name: "Climate Tech & Green Energy", icon: "Leaf", color: "from-green-500 to-emerald-500", desc: "Carbon capture models, hydrogen fuel optimization, smart grid networks, and marine science." },
  { id: "neuro", name: "Neurotech & Brain Interfaces", icon: "Zap", color: "from-yellow-500 to-orange-500", desc: "Neural links, brain-computer interfaces (BCI), electroencephalogram processing, and prosthetics." },
  { id: "nano", name: "Nanotechnology & Materials", icon: "Atom", color: "from-blue-500 to-teal-500", desc: "Carbon nanotubes, metamaterials, atomic layers, and structural quantum dots." },
  { id: "robot", name: "Robotics & Autonomous Systems", icon: "Compass", color: "from-indigo-500 to-pink-500", desc: "Path planning algorithms, human-robot interaction, swarm robotics, and sensor fusion." },
  { id: "iot", name: "Edge IoT & Future Networks", icon: "Radio", color: "from-cyan-500 to-emerald-500", desc: "5G/6G communication systems, distributed edge computing, and sensor networks." }
];

const EXTRA_TOPICS = [
  "Deep Learning", "Generative AI", "Large Language Models", "Quantum Cryptography", "Gene Editing", 
  "Protein Folding", "Exoplanet Analysis", "Black Hole Physics", "Blockchain Consensus", "Zero Trust Architectures", 
  "Fusion Energy", "Battery Chemistry", "Microbiome Research", "Brain-Computer Interface", "Graphene Materials", 
  "Swarm Intelligence", "Autonomous Driving", "6G Systems", "Software Engineering Systems", "Human-Computer Interaction",
  "Reinforcement Learning", "Graph Neural Networks", "Explainable AI", "Optoelectronics", "Renewable Grids"
];

const COUNTRIES = ["United States", "United Kingdom", "Germany", "Switzerland", "Japan", "Canada", "Singapore", "Australia", "India", "France"];

const CITIES = [
  { name: "San Francisco", lat: 37.7749, lng: -122.4194 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Munich", lat: 48.1351, lng: 11.5820 },
  { name: "Zurich", lat: 47.3769, lng: 8.5417 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Paris", lat: 48.8566, lng: 2.3522 }
];

const UNIVERSITIES = [
  { name: "MIT", domain: "mit.edu" },
  { name: "Stanford University", domain: "stanford.edu" },
  { name: "University of Cambridge", domain: "cam.ac.uk" },
  { name: "ETH Zurich", domain: "ethz.ch" },
  { name: "University of Tokyo", domain: "u-tokyo.ac.jp" },
  { name: "University of Toronto", domain: "utoronto.ca" },
  { name: "National University of Singapore", domain: "nus.edu.sg" },
  { name: "Australian National University", domain: "anu.edu.au" },
  { name: "IISc Bangalore", domain: "iisc.ac.in" },
  { name: "Sorbonne University", domain: "sorbonne-universite.fr" },
  { name: "Harvard University", domain: "harvard.edu" },
  { name: "UC Berkeley", domain: "berkeley.edu" },
  { name: "Oxford University", domain: "ox.ac.uk" },
  { name: "TUM Munich", domain: "tum.de" },
  { name: "Kyoto University", domain: "kyoto-u.ac.jp" },
  { name: "McGill University", domain: "mcgill.ca" },
  { name: "Nanyang Technological University", domain: "ntu.edu.sg" },
  { name: "University of Melbourne", domain: "unimelb.edu.au" },
  { name: "IIT Bombay", domain: "iitb.ac.in" },
  { name: "École Polytechnique", domain: "polytechnique.edu" },
  { name: "Princeton University", domain: "princeton.edu" },
  { name: "Caltech", domain: "caltech.edu" },
  { name: "Imperial College London", domain: "imperial.ac.uk" },
  { name: "EPFL Lausanne", domain: "epfl.ch" },
  { name: "Tohoku University", domain: "tohoku.ac.jp" },
  { name: "UBC Vancouver", domain: "ubc.ca" },
  { name: "NUS Singapore", domain: "nus.edu.sg" },
  { name: "Sydney University", domain: "sydney.edu.au" },
  { name: "IIT Delhi", domain: "iitd.ac.in" },
  { name: "Université de Paris", domain: "u-paris.fr" }
];

const LABS = [
  { name: "CERN OpenLab", domain: "cern.ch" },
  { name: "DeepMind Research", domain: "deepmind.google" },
  { name: "Bell Labs", domain: "bell-labs.com" },
  { name: "Max Planck Institute", domain: "mpg.de" },
  { name: "RIKEN Center for AI", domain: "riken.jp" },
  { name: "Perimeter Institute", domain: "perimeterinstitute.ca" },
  { name: "A*STAR Labs", domain: "a-star.edu.sg" },
  { name: "Microsoft Research", domain: "microsoft.com" }
];

// Helper to get high-quality tech images
const getUnsplashUrl = (keyword: string, index: number) => {
  const ids = [
    "photo-1507679799987-c73779587ccf", "photo-1531297484001-80022131f5a1", "photo-1518770660439-4636190af475",
    "photo-1451187580459-43490279c0fa", "photo-1504384308090-c894fdcc538d", "photo-1526374965328-7f61d4dc18c5",
    "photo-1527474305487-b87b222841cc", "photo-1488590528505-98d2b5aba04b", "photo-1516321318423-f06f85e504b3",
    "photo-1509023464722-18d996393ca8", "photo-1563986768609-322da13575f3", "photo-1544256718-3bcf237f3974",
    "photo-1581091226825-a6a2a5aee158", "photo-1535378917042-10a22c95931a", "photo-1461749280684-dccba630e2f6"
  ];
  const id = ids[index % ids.length];
  return `https://images.unsplash.com/${id}?q=80&w=600&auto=format&fit=crop`;
};

// Helper for avatars
const getAvatarUrl = (gender: "m" | "f", index: number) => {
  return `https://randomuser.me/api/portraits/${gender === "m" ? "men" : "women"}/${index % 95}.jpg`;
};

// -------------------------------------------------------------
// SEED DATA GENERATOR FUNCTION
// -------------------------------------------------------------
export const generateSeedData = () => {
  // 1. Generate Institutions (35 items)
  const institutions: Institution[] = [];
  
  // Universities (28 items)
  for (let i = 0; i < 28; i++) {
    const countryIndex = i % COUNTRIES.length;
    const uni = UNIVERSITIES[i % UNIVERSITIES.length];
    institutions.push({
      id: `inst-uni-${i}`,
      name: uni.name,
      logo: `https://logos.hunter.io/${uni.domain}` || `https://images.unsplash.com/photo-1594312915251-48db9280c8f1?q=80&w=80&auto=format&fit=crop`,
      location: CITIES[i % CITIES.length].name,
      type: "University",
      country: COUNTRIES[countryIndex],
      website: `https://www.${uni.domain}`
    });
  }
  
  // Research Labs (7 items)
  for (let i = 0; i < 7; i++) {
    const countryIndex = (i + 3) % COUNTRIES.length;
    const lab = LABS[i % LABS.length];
    institutions.push({
      id: `inst-lab-${i}`,
      name: lab.name,
      logo: `https://logos.hunter.io/${lab.domain}` || `https://images.unsplash.com/photo-1532187863486-abf9d39d66e8?q=80&w=80&auto=format&fit=crop`,
      location: CITIES[(i + 4) % CITIES.length].name,
      type: "Research Institute",
      country: COUNTRIES[countryIndex],
      website: `https://www.${lab.domain}`
    });
  }

  // 2. Generate Speakers (90 items)
  const speakers: Speaker[] = [];
  const firstNamesM = ["Liam", "Noah", "Oliver", "James", "William", "Benjamin", "Lucas", "Henry", "Alexander", "Mason", "Michael", "Ethan", "Daniel", "Jacob", "Logan", "Jackson", "Levi", "Sebastian", "Jack", "Aiden"];
  const firstNamesF = ["Olivia", "Emma", "Charlotte", "Amelia", "Sophia", "Isabella", "Ava", "Mia", "Evelyn", "Harper", "Luna", "Camila", "Gianna", "Elizabeth", "Eleanor", "Ella", "Abigail", "Sofia", "Avery", "Scarlett"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"];

  for (let i = 0; i < 90; i++) {
    const isMale = i % 2 === 0;
    const firstName = isMale ? firstNamesM[i % firstNamesM.length] : firstNamesF[i % firstNamesF.length];
    const lastName = lastNames[(i * 3) % lastNames.length];
    const name = `Dr. ${firstName} ${lastName}`;
    const inst = institutions[i % institutions.length];
    
    // Select 3 random research interests
    const interests = [
      DOMAINS[i % DOMAINS.length].name,
      EXTRA_TOPICS[(i * 2) % EXTRA_TOPICS.length],
      EXTRA_TOPICS[(i * 3 + 1) % EXTRA_TOPICS.length]
    ];
    
    speakers.push({
      id: `speaker-${i}`,
      name,
      avatar: getAvatarUrl(isMale ? "m" : "f", i),
      bio: `${name} is a leading researcher in ${interests[0]} and ${interests[1]}. Currently working closely with ${inst.name}, their work is focused on breakthrough methods and computing paradigms that push the envelope of modern technology. Prior to this, they served as a principal researcher in various international teams.`,
      title: i % 3 === 0 ? "Professor of Computer Science" : i % 3 === 1 ? "Principal Research Scientist" : "Director of Engineering & Innovation",
      institutionId: inst.id,
      researchInterests: interests,
      publicationCount: 30 + (i * 2) % 150,
      talkCount: 15 + (i % 30),
      socialLinks: {
        twitter: `https://twitter.com/${firstName.toLowerCase()}_rs`,
        linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
        github: `https://github.com/${firstName.toLowerCase()}-research`,
        scholar: `https://scholar.google.com/citations?user=rs_${i}`
      },
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      timeline: [
        { year: 2018, event: `Awarded prestigious young researcher prize in ${interests[0]}` },
        { year: 2021, event: `Published seminal work on ${interests[1]} with over 500+ citations` },
        { year: 2023, event: `Joined the steering committee of International Conference on Future Tech` }
      ],
      talkHistory: [
        { title: `Keynote: The Evolution of ${interests[0]}`, event: "Global Discovery Symposium", year: 2023 },
        { title: `Panel: Ethical Frameworks in ${interests[1]}`, event: "Future Tech Summit", year: 2024 }
      ]
    });
  }

  // 3. Generate Sponsors (25 items)
  const sponsors: Sponsor[] = [];
  const sponsorCompanies = [
    "Google DeepMind", "Microsoft Research", "IBM Quantum", "Meta AI", "NVIDIA",
    "Intel Labs", "AMD Research", "AWS Research", "OpenAI", "Oracle Cloud",
    "Salesforce AI", "Cisco Systems", "Huawei Research", "Sony AI", "Samsung Research",
    "Tencent Quantum", "Baidu Brain", "Siemens Health", "General Electric", "Pfizer Science",
    "Moderna Labs", "Tesla Robotics", "SpaceX Engineering", "Biogen", "TSMC Research"
  ];
  for (let i = 0; i < 25; i++) {
    const tier = i < 5 ? "Diamond" : i < 12 ? "Gold" : "Silver";
    sponsors.push({
      id: `sponsor-${i}`,
      name: sponsorCompanies[i],
      logo: `https://logos.hunter.io/${sponsorCompanies[i].toLowerCase().replace(/\s+/g, "")}.com` || `https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=80&auto=format&fit=crop`,
      tier,
      website: `https://www.${sponsorCompanies[i].toLowerCase().replace(/\s+/g, "")}.com`
    });
  }

  // 4. Generate Communities (30 items)
  const communities: Community[] = [];
  const commNames = [
    "Global AI Alliance", "Quantum Developers Network", "Bioinformatics Collective", "AstroPhysics Network",
    "Decentralized Cryptographers", "Climate Tech Coalition", "Neurotech Innovators", "Material Science Forum",
    "Open Robotics Association", "Edge Computing Consortium", "Deep Learning Study Group", "Natural Language Processing Society",
    "CRISPR Research Guild", "Theoretical Physics Circle", "Cyber Security Pioneers", "Smart Grid Working Group",
    "Brain BCI Syndicate", "Graphene Devs", "Autonomous Flight Lab", "Next-Gen 6G Alliance",
    "Ethics in Science", "Women in Tech Research", "Undergraduate Research Network", "Silicon Valley Tech Meetup",
    "European Science Circle", "Asia-Pacific AI Hub", "African STEM Initiative", "Latin America Devs",
    "Space Colonization Forum", "Metaverse Standards Group"
  ];
  for (let i = 0; i < 30; i++) {
    communities.push({
      id: `community-${i}`,
      name: commNames[i],
      description: `A collaborative workspace and networking hub for researchers, professionals, and students passionate about ${commNames[i]}. We hold bi-weekly seminars, share recent publications, and host hackathons.`,
      membersCount: 150 + (i * 123) % 4500,
      logo: getUnsplashUrl("community", i),
      fields: [DOMAINS[i % DOMAINS.length].name, EXTRA_TOPICS[(i * 2) % EXTRA_TOPICS.length]],
      eventsCount: 5 + (i % 25)
    });
  }

  // 5. Generate Testimonials (45 items)
  const testimonials: Testimonial[] = [];
  const comments = [
    "Conference Website has completely changed how I discover upcoming conferences. The user experience is state-of-the-art!",
    "Finding collaborators is usually incredibly tedious, but the author networks on Conference Website made it intuitive and smooth.",
    "As an organizer, hosting our track details, schedules, and papers on Conference Website increased our registrations by 45%.",
    "The citation network graphs are gorgeous and genuinely useful for literature reviews.",
    "A stunning platform that merges design and functional research data in a premium, elegant interface.",
    "Being able to download resources, watch recorded sessions, and access published papers in one unified profile is fantastic.",
    "The speaker spotlight is a great feature to highlight diverse voices in the scientific community.",
    "I registered for three workshops and a hackathon within minutes. The check-out and ticket generation was seamless."
  ];
  for (let i = 0; i < 45; i++) {
    const isMale = i % 2 === 0;
    const name = `${isMale ? firstNamesM[i % firstNamesM.length] : firstNamesF[i % firstNamesF.length]} ${lastNames[(i * 4) % lastNames.length]}`;
    testimonials.push({
      id: `testimonial-${i}`,
      user: name,
      title: i % 2 === 0 ? "Graduate Researcher" : "Conference Program Chair",
      role: i % 3 === 0 ? "MIT AI Lab" : i % 3 === 1 ? "IEEE Steering Committee" : "Senior Dev, Google DeepMind",
      comment: comments[i % comments.length],
      avatar: getAvatarUrl(isMale ? "m" : "f", i + 10),
      rating: i % 10 === 0 ? 4 : 5
    });
  }

  // 6. Generate News Articles (80 items)
  const news: News[] = [];
  const newsTitles = [
    "Breakthrough in Quantum Entanglement Communication",
    "How Large Language Models are Transforming Protein Structure Prediction",
    "New Carbon-Capture Polymer Offers 10x Efficiency Boost",
    "Astrophysicists Detect Unusual Signal from Kepler-186f System",
    "The Rise of Post-Quantum Cryptography in Modern Web Protocols",
    "Zero-Knowledge Proofs: The Future of Decoupled Digital Identity",
    "Neurotech BCI Device Receives Breakthrough FDA Status",
    "Graphene Nanotubes Pave the Way for Solid-State Battery Revolution",
    "Swarm Intelligence Algorithms Optimize Global Logistics Grids",
    "6G Architecture Standards Drafted by Global Consortium",
    "Open Robotics Releases Next-Gen Humanoid Control Framework",
    "CRISPR Gene Therapy Safely Reverses Blindness in Clinical Trial",
    "The Ethics of Generative AI in Scientific Publishing",
    "Undergraduates Build Open-Source Satellite using Off-the-Shelf Parts",
    "Global Warming Models Revised as Ocean Temperatures Surge",
    "DeepMind Unveils AlphaGenomics for Single Variant Analysis"
  ];
  for (let i = 0; i < 80; i++) {
    const title = newsTitles[i % newsTitles.length] + ` — Volume ${Math.floor(i / newsTitles.length) + 1}`;
    news.push({
      id: `news-${i}`,
      title,
      excerpt: `Recent reports show a significant development in the field of study. Researchers are optimistic about the future applications of this breakthrough.`,
      content: `### Executive Summary\n\nThis article reviews the recent breakthrough in this domain. Key institutions have published joint findings indicating a major shift in paradigms. The experiments conducted show stable, repeatable results across multiple tests.\n\n### Key Findings\n\n- **Efficiency:** The newly developed systems demonstrate a substantial increase in output metrics.\n- **Adaptability:** Test environments showed that the system scales well across different operating parameters.\n- **Open Source:** The code and datasets have been made public to encourage global research and replication.\n\n### Future Outlook\n\nAs peer reviews begin, the steering committee hopes to see rapid integration of these designs in commercial and academic applications. Future iterations will focus on reducing resource consumption and improving overall latency.`,
      coverImage: getUnsplashUrl("research", i),
      author: speakers[i % speakers.length].name,
      publishDate: new Date(2024, i % 4, (i % 28) + 1).toISOString().split('T')[0],
      readTime: 4 + (i % 8),
      tags: [DOMAINS[i % DOMAINS.length].name, "Breakthrough", "Technology"]
    });
  }

  // 7. Generate Conferences (50 items)
  const conferences: Conference[] = [];
  const confNames = [
    "International Conference on Neural Architectures",
    "Quantum Computation and Information Summit",
    "Bioinformatics and Genomic Analysis Congress",
    "Astrophysics and Cosmic Space Explorations",
    "Global Cryptography and Cyber Security Forum",
    "Climate Change Solutions & Green Energy Expo",
    "Neurotechnologies and Brain Interfaces Colloquium",
    "Nanotechnology and Advanced Materials Seminar",
    "Autonomous Robotics and Control Symposium",
    "Edge Communications & IoT Tech Conference"
  ];

  for (let i = 0; i < 50; i++) {
    const startM = (i % 4) + 1; // Feb to May 2024
    const startD = (i % 20) + 1;
    const endD = startD + 2;
    const startDate = `2024-0${startM}-${startD < 10 ? '0' + startD : startD}`;
    const endDate = `2024-0${startM}-${endD < 10 ? '0' + endD : endD}`;
    
    const city = CITIES[i % CITIES.length];
    const status = startM === 2 && startD < 10 ? "Past" : startM === 2 ? "Ongoing" : "Upcoming";
    
    // Tracks
    const domain = DOMAINS[i % DOMAINS.length];
    const tracks = [
      `${domain.name} Fundamentals`,
      `Advanced Applications in ${domain.name}`,
      `Ethics & Global Policies in ${domain.name}`,
      `Emerging Trends and Open Debates`
    ];

    // Speakers assigned
    const speakerIds: string[] = [];
    for (let s = 0; s < 8; s++) {
      speakerIds.push(`speaker-${(i * 5 + s) % 90}`);
    }

    // Sponsors assigned
    const sponsorIds: string[] = [];
    for (let sp = 0; sp < 4; sp++) {
      sponsorIds.push(`sponsor-${(i * 3 + sp) % 25}`);
    }

    // Generate Sessions
    const sessions: Session[] = [];
    const rooms = ["Hall A (Main)", "Hall B", "Room 402", "Virtual Room Alpha"];
    for (let se = 0; se < 6; se++) {
      const track = tracks[se % tracks.length];
      sessions.push({
        id: `conf-${i}-session-${se}`,
        title: `${se === 0 ? 'Keynote Address:' : 'Panel Discussion on'} ${track}`,
        description: `This session explores recent developments in ${track}, discussing future frameworks and current pain points.`,
        startTime: `${10 + se}:00`,
        endTime: `${11 + se}:30`,
        speakerIds: [speakerIds[se % speakerIds.length], speakerIds[(se + 1) % speakerIds.length]],
        room: rooms[se % rooms.length],
        track
      });
    }

    // FAQs
    const faqs = [
      { question: "Is online attendance supported?", answer: "Yes, this is a hybrid event. All sessions will be streamed live via our community portal and recordings will be posted afterwards." },
      { question: "How do I submit my research paper?", answer: "Submissions are managed via the call-for-papers panel. Please review the formatting instructions in the resources tab before uploading." },
      { question: "Are student discounts available?", answer: "Absolutely. Student tickets are discounted by 60%. Please verify your academic status during registration." }
    ];

    // Resources
    const resources = [
      { name: "Conference Brochure PDF", size: "2.4 MB", url: "#", type: "pdf" },
      { name: "Submission Templates (LaTeX)", size: "450 KB", url: "#", type: "zip" },
      { name: "Code of Conduct Document", size: "120 KB", url: "#", type: "pdf" }
    ];

    conferences.push({
      id: `conf-${i}`,
      title: confNames[i % confNames.length] + ` 2024 (RS-${i + 100})`,
      logo: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=80&auto=format&fit=crop`,
      coverImage: getUnsplashUrl("conference", i),
      description: `The ${confNames[i % confNames.length]} is the premier international gathering for researchers, developers, and educators. This edition is co-hosted with leading universities and labs to discuss major innovations in ${domain.name}.`,
      startDate,
      endDate,
      venue: `International Convention Center, ${city.name}`,
      location: `${city.name}, ${COUNTRIES[i % COUNTRIES.length]}`,
      coordinates: { lat: city.lat, lng: city.lng },
      registrationFee: 99 + (i * 25) % 400,
      registrationStatus: i % 3 === 0 ? "Closed" : i % 5 === 0 ? "Selling Fast" : "Open",
      status,
      tracks,
      sessions,
      speakerIds,
      sponsorIds,
      paperIds: [], // populated later
      resources,
      faqs
    });
  }

  // 8. Generate Research Papers (125 items)
  const papers: Paper[] = [];
  const paperVerbs = ["A Unified Framework for", "Deep Analysis of", "Optimizing", "Re-evaluating", "Next-Generation Protocols for", "Scaling Neural Networks in", "Evolutionary Modeling of", "Addressing Core Latency in"];
  const paperNouns = ["Self-Supervised Contrastive Learning", "Superconducting Quantum Qubits", "CRISPR Gene Sequences", "Dark Energy Accelerations", "Zero-Knowledge Consensus", "Solid-State Lithography", "Brain-Computer Interface Latencies", "Metamaterial Waveguides"];

  for (let i = 0; i < 125; i++) {
    const title = `${paperVerbs[i % paperVerbs.length]} ${paperNouns[(i + 2) % paperNouns.length]} in Global Ecosystems`;
    
    // Assign 1-3 authors
    const authorIds = [`speaker-${i % 90}`];
    if (i % 2 === 0) authorIds.push(`speaker-${(i + 10) % 90}`);
    if (i % 4 === 0) authorIds.push(`speaker-${(i + 25) % 90}`);
    
    const firstAuthor = speakers[i % 90];
    const instIds = [firstAuthor.institutionId];
    
    // Find matching conference
    const confId = `conf-${i % 50}`;
    
    const domain = DOMAINS[i % DOMAINS.length];

    papers.push({
      id: `paper-${i}`,
      title,
      abstract: `This paper introduces a novel method that addresses significant computational challenges in ${domain.name}. We outline our mathematical proof, validate using standard simulators, and compare performance metrics with existing baselines. Our findings demonstrate a 15-22% increase in operational throughput while reducing memory consumption by up to 30%. This opens new paths for commercial deployments and theoretical expansion.`,
      authorIds,
      institutionIds: instIds,
      citationsCount: 5 + (i * 7) % 350,
      downloadUrl: "#",
      publishDate: new Date(2024, i % 4, (i % 28) + 1).toISOString().split('T')[0],
      topics: [domain.name, EXTRA_TOPICS[(i * 3) % EXTRA_TOPICS.length]],
      conferenceId: confId,
      citations: [], // Populated after creating basic list
      readingTime: 6 + (i % 12)
    });
    
    // Link paper ID back to the conference
    const targetConf = conferences[i % 50];
    if (targetConf) {
      targetConf.paperIds.push(`paper-${i}`);
    }
  }

  // Populate Citation Network (make papers cite each other)
  for (let i = 0; i < 125; i++) {
    const citations: string[] = [];
    const citeCount = 2 + (i % 5);
    for (let c = 0; c < citeCount; c++) {
      const citeId = `paper-${(i + c * 13 + 1) % 125}`;
      if (citeId !== `paper-${i}` && !citations.includes(citeId)) {
        citations.push(citeId);
      }
    }
    papers[i].citations = citations;
  }

  // 9. Generate Announcements (60 items)
  const announcements: Announcement[] = [];
  const announcementTemplates = [
    { title: "Call for Papers Extended!", content: "Good news! We have extended the paper submission deadline by two weeks. Please submit via the portal.", type: "info" as const },
    { title: "Schedule Change Announcement", content: "The program committee has updated the Day 2 morning tracks. Please verify the updated room details.", type: "warning" as const },
    { title: "Keynote Speaker Confirmed!", content: "We are thrilled to welcome our new keynote speaker who will discuss groundbreaking neural architectures.", type: "success" as const },
    { title: "Registration is Now Open!", content: "Early-bird passes are officially online. Book now to secure a 30% discount on registrations.", type: "success" as const },
    { title: "Poster Session Guidelines Uploaded", content: "Guidelines for presenting posters are available in the downloads tab. Review sizes and requirements.", type: "info" as const }
  ];
  for (let i = 0; i < 60; i++) {
    const template = announcementTemplates[i % announcementTemplates.length];
    const confId = `conf-${i % 50}`;
    announcements.push({
      id: `announce-${i}`,
      conferenceId: confId,
      title: template.title + ` — Conf ${i % 50}`,
      content: template.content,
      date: new Date(2024, 0, (i % 28) + 1).toISOString().split('T')[0],
      type: template.type
    });
  }

  // 10. Generate Gallery Albums & Images (35 albums, reaching 500+ total image records dynamically)
  const albums: Album[] = [];
  let imageCounter = 0;
  for (let i = 0; i < 35; i++) {
    const confId = `conf-${i % 50}`;
    const images: string[] = [];
    const imagesInAlbum = 15; // 35 * 15 = 525 total images in database
    for (let img = 0; img < imagesInAlbum; img++) {
      images.push(getUnsplashUrl("technology", imageCounter++));
    }
    
    albums.push({
      id: `album-${i}`,
      conferenceId: confId,
      name: `Photo Album: ${conferences[i % 50].title}`,
      description: `Captured moments during the technical sessions, panels, workshop groups, and social mixers at ${conferences[i % 50].title}.`,
      coverImage: images[0],
      images
    });
  }

  return {
    domains: DOMAINS,
    institutions,
    speakers,
    sponsors,
    communities,
    testimonials,
    news,
    conferences,
    papers,
    announcements,
    albums
  };
};
