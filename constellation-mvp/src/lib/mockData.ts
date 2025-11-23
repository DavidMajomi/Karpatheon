// Mock Data Generator for The Constellation MVP
// Generates realistic nodes and user statistics

export type NodeGroup = 'math' | 'history' | 'coding' | 'philosophy' | 'science';

export interface GraphNode {
  id: string;
  title: string;
  group: NodeGroup;
  x: number;
  y: number;
  comprehensionScore: number; // 0-100, controls glow
  lastInteracted: Date;
  noteContent: any; // JSON content for BlockNote
}

export interface UserStats {
  level: number;
  streak: number;
  skillDistribution: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
}

// Subject titles for each group
const mathTitles = [
  'Linear Algebra Fundamentals',
  'Calculus: Derivatives & Integrals',
  'Probability Theory',
  'Differential Equations',
  'Matrix Operations',
  'Vector Spaces',
  'Fourier Transform',
  'Optimization Techniques',
  'Statistical Inference',
  'Number Theory Basics',
  'Graph Theory',
  'Topology Introduction',
];

const historyTitles = [
  'The Renaissance Period',
  'World War II: Key Events',
  'Ancient Greek Philosophy',
  'The Industrial Revolution',
  'Medieval Europe',
  'The Cold War',
  'Ancient Rome: Rise & Fall',
  'The French Revolution',
  'Colonial America',
  'The Byzantine Empire',
  'The Enlightenment',
  'The Reformation',
];

const codingTitles = [
  'React Hooks Deep Dive',
  'TypeScript Advanced Types',
  'GraphQL Query Optimization',
  'WebGL Shader Programming',
  'System Design Patterns',
  'Database Indexing Strategies',
  'Microservices Architecture',
  'Functional Programming',
  'Async/Await Patterns',
  'State Management Solutions',
  'Performance Optimization',
  'Testing Best Practices',
];

const philosophyTitles = [
  'Stoicism: Core Principles',
  'Existentialism Overview',
  'Ethics: Utilitarianism',
  'Metaphysics: Reality & Being',
  'Epistemology: Knowledge Theory',
  'Logic & Reasoning',
  'Eastern Philosophy',
  'Political Philosophy',
  'Aesthetics & Art',
  'Philosophy of Mind',
];

const scienceTitles = [
  'Quantum Mechanics Basics',
  'General Relativity',
  'Evolutionary Biology',
  'Organic Chemistry Reactions',
  'Astrophysics: Black Holes',
  'Molecular Biology',
  'Thermodynamics Laws',
  'Neuroscience: Brain Function',
  'Particle Physics',
  'Climate Science',
  'Genetics & DNA',
  'Electromagnetism',
];

const allTitles: Record<NodeGroup, string[]> = {
  math: mathTitles,
  history: historyTitles,
  coding: codingTitles,
  philosophy: philosophyTitles,
  science: scienceTitles,
};

// Generate a random date within the last 90 days
function randomRecentDate(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 90);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

// Generate note content as JSON (simplified BlockNote format)
function generateNoteContent(title: string, group: NodeGroup): any {
  return {
    blocks: [
      {
        id: 'block-1',
        type: 'heading',
        props: {
          level: 1,
          textColor: 'default',
        },
        content: [
          {
            type: 'text',
            text: title,
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: 'block-2',
        type: 'paragraph',
        props: {
          textColor: 'default',
        },
        content: [
          {
            type: 'text',
            text: `This is a note about ${title} in the ${group} category. This note contains important information and insights that help build understanding of the topic.`,
            styles: {},
          },
        ],
        children: [],
      },
      {
        id: 'block-3',
        type: 'paragraph',
        props: {
          textColor: 'default',
        },
        content: [
          {
            type: 'text',
            text: 'Key concepts and ideas are explored here, forming connections with other knowledge nodes in the constellation.',
            styles: {},
          },
        ],
        children: [],
      },
    ],
  };
}

// Generate nodes with realistic distribution
export function generateNodes(count: number = 50): GraphNode[] {
  const nodes: GraphNode[] = [];
  const groups: NodeGroup[] = ['math', 'history', 'coding', 'philosophy', 'science'];
  
  // Ensure at least 10 nodes per group
  const nodesPerGroup = Math.floor(count / groups.length);
  const remainder = count % groups.length;
  
  groups.forEach((group, groupIndex) => {
    const groupCount = nodesPerGroup + (groupIndex < remainder ? 1 : 0);
    const titles = allTitles[group];
    
    for (let i = 0; i < groupCount; i++) {
      const titleIndex = i % titles.length;
      const title = titles[titleIndex] + (i >= titles.length ? ` ${Math.floor(i / titles.length) + 1}` : '');
      
      // Generate realistic comprehension scores (weighted towards middle-high range)
      const comprehensionScore = Math.min(
        100,
        Math.max(
          20,
          Math.floor(
            Math.random() * 40 + // Base 0-40
            Math.random() * 30 + // Additional 0-30
            Math.random() * 30   // Additional 0-30
          )
        )
      );
      
      // Generate initial positions (will be adjusted by force graph)
      const angle = (Math.PI * 2 * i) / groupCount + (groupIndex * Math.PI * 2) / groups.length;
      const radius = 200 + Math.random() * 300;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      nodes.push({
        id: `${group}-${i}`,
        title,
        group,
        x,
        y,
        comprehensionScore,
        lastInteracted: randomRecentDate(),
        noteContent: generateNoteContent(title, group),
      });
    }
  });
  
  return nodes;
}

// Generate user statistics
export function generateUserStats(): UserStats {
  return {
    level: Math.floor(Math.random() * 20) + 5, // Level 5-25
    streak: Math.floor(Math.random() * 30) + 1, // 1-30 day streak
    skillDistribution: [
      {
        subject: 'Math',
        A: Math.floor(Math.random() * 50) + 80, // 80-130
        fullMark: 150,
      },
      {
        subject: 'History',
        A: Math.floor(Math.random() * 50) + 70, // 70-120
        fullMark: 150,
      },
      {
        subject: 'Coding',
        A: Math.floor(Math.random() * 50) + 100, // 100-150
        fullMark: 150,
      },
      {
        subject: 'Philosophy',
        A: Math.floor(Math.random() * 50) + 60, // 60-110
        fullMark: 150,
      },
      {
        subject: 'Science',
        A: Math.floor(Math.random() * 50) + 85, // 85-135
        fullMark: 150,
      },
    ],
  };
}

// Generate activity data for heatmap (last 365 days)
export function generateActivityData(): Array<{ date: string; count: number }> {
  const data: Array<{ date: string; count: number }> = [];
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (365 - i));
    
    // More activity in recent days (simulating active user)
    const daysAgo = 365 - i;
    const activityProbability = daysAgo < 30 ? 0.7 : daysAgo < 90 ? 0.4 : 0.2;
    
    const count = Math.random() < activityProbability
      ? Math.floor(Math.random() * 5) + 1 // 1-5 activities
      : 0;
    
    data.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }
  
  return data;
}

// Export default generated data
export const mockNodes = generateNodes(55);
export const mockUserStats = generateUserStats();
export const mockActivityData = generateActivityData();

