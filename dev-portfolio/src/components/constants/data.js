
// ─── IDENTITY ────────────────────────────────────────────────────────────────
export const IDENTITY = {
  name: 'Sujit Kumar Shaw',
  initials: 'SKS',
  role: 'Full Stack Developer',
  tagline: 'Building scalable web apps with clean architecture.',
  bio: `Full-stack developer skilled in React, Spring Boot, and modern web technologies.
I focus on building scalable, performant applications with clean architecture and great user experience.`,
  email: 'sujitshaw029@gmail.com',
  location: { lat: 22.5726, lng: 88.3639, city: 'Kolkata' },
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

// ─── SOCIAL ──────────────────────────────────────────────────────────────────
export const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/sujit-27',
    icon: 'github',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/sujit-kumar-shaw',
    icon: 'linkedin',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/sujit.815',
    icon: 'instagram',
  },
];

// ─── TYPEWRITER ROLES ────────────────────────────────────────────────────────
export const ROLES = [
  'Full Stack Developer',
  'Java + Spring Boot Developer',
  'React Developer',
  'Problem Solver',
];

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 1,
    emoji: '📧',
    title: 'MailForge',
    description:
      'Event-driven email processing system using Kafka for scalable and reliable message handling.',
    tags: ['Java', 'Spring Boot', 'Kafka', 'Docker', 'GRPC'],
    github: 'https://github.com/sujit-27/Mailforge',
    live: 'https://mail-forge-plum.vercel.app/',
    image: '/src/assets/projects/mailforge.png',
  },
  {
    id: 2,
    emoji: '🧠',
    title: 'CertiQuest',
    description:
      'Interactive platform for managing and exploring certification-based learning with structured content and tracking.',
    tags: ['Java', 'Spring Boot', 'Clerk', 'React', 'Tailwind'],
    github: 'https://github.com/sujit-27/CertiQuest',
    live: 'https://certi-quest-gamma.vercel.app/',
    image: '/src/assets/projects/certiquest.png',
  },
  {
    id: 3,
    emoji: '🛒',
    title: 'Trendora Ecommerce',
    description:
      'Full-stack ecommerce platform with authentication, admin dashboard, product management, and checkout flow.',
    tags: ['React', 'Redux', 'Appwrite', 'Tailwind'],
    github: 'https://github.com/sujit-27/Trendora',
    live: 'https://trendora-gules.vercel.app/',
    image: '/src/assets/projects/trendora.png',
  },
];

// ─── SKILLS ──────────────────────────────────────────────────────────────────
export const SKILLS = {
  Frontend: [
    { name: 'React', level: 85 },
    { name: 'JavaScript', level: 85 },
    { name: 'HTML/CSS', level: 90 },
    { name: 'Tailwind CSS', level: 88 },
    { name: 'Redux', level: 80 },
  ],

  Backend: [
    { name: 'Java (Spring Boot)', level: 88 },
    { name: 'Appwrite', level: 82 },
    { name: 'REST APIs', level: 85 },
    { name: 'PostgreSQL', level: 80 },
  ],

  DevOps: [
    { name: 'Git & GitHub', level: 92 },
    { name: 'Docker (Basics)', level: 70 },
    { name: 'Vercel', level: 85 },
  ],

  Tools: [
    { name: 'Postman', level: 85 },
    { name: 'VS Code', level: 95 },
    { name: 'IntelliJ IDEA', level: 85 },
    { name: 'Eclipse IDE', level: 85 },
  ],
};

// ─── TECH STACK (FOR UI DISPLAY) ─────────────────────────────────────────────
export const TECH_STACK = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Java', color: '#f89820' },
  { name: 'Spring Boot', color: '#6DB33F' },
  { name: 'JavaScript', color: '#F7DF1E' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Appwrite', color: '#FD366E' },
  { name: 'Tailwind', color: '#38BDF8' },
  { name: 'Git', color: '#F05032' },
];