export type SlideType = 'hero' | 'text-cards' | 'quote' | 'diagram' | 'metrics' | 'timeline' | 'two-column' | 'closing';

export interface SlideTypeMeta {
  type: SlideType;
  label: string;
  description: string;
  icon: string;
  defaultContent: Record<string, any>;
}

export const SLIDE_TYPES: SlideTypeMeta[] = [
  {
    type: 'hero',
    label: 'Hero',
    description: 'Bold opening slide with headline',
    icon: '⬡',
    defaultContent: {
      accent_text: 'OPENCLAW SAMANTHA',
      headline: 'Your Headline Here',
      subheadline: 'Supporting text that adds context and depth',
    },
  },
  {
    type: 'text-cards',
    label: 'Text + Cards',
    description: 'Heading with information cards',
    icon: '▦',
    defaultContent: {
      heading: 'Key Points',
      description: 'An overview of the most important topics',
      cards: [
        { title: 'First Point', body: 'Description of the first key insight or concept.' },
        { title: 'Second Point', body: 'Description of the second key insight or concept.' },
        { title: 'Third Point', body: 'Description of the third key insight or concept.' },
      ],
    },
  },
  {
    type: 'quote',
    label: 'Quote',
    description: 'Prominent quote with attribution',
    icon: '❝',
    defaultContent: {
      quote: 'The best way to predict the future is to invent it.',
      author: 'Alan Kay',
      role: 'Computer Scientist',
    },
  },
  {
    type: 'diagram',
    label: 'Layer Diagram',
    description: 'Stacked layers visualization',
    icon: '☰',
    defaultContent: {
      title: 'Architecture Overview',
      description: 'How the layers connect and interact',
      layers: [
        { label: 'Presentation', color: '#38bdf8', items: ['UI Components', 'Views', 'Routing'] },
        { label: 'Logic', color: '#818cf8', items: ['Business Rules', 'Validation', 'Processing'] },
        { label: 'Data', color: '#a78bfa', items: ['Database', 'API', 'Cache'] },
      ],
    },
  },
  {
    type: 'metrics',
    label: 'Metrics',
    description: 'Key numbers and statistics',
    icon: '📊',
    defaultContent: {
      heading: 'Key Metrics',
      description: 'Performance indicators at a glance',
      metrics: [
        { value: '99.9%', label: 'Uptime', change: '+0.2%' },
        { value: '2.4M', label: 'Users', change: '+18%' },
        { value: '<50ms', label: 'Latency', change: '-12ms' },
        { value: '4.8★', label: 'Rating', change: '+0.3' },
      ],
    },
  },
  {
    type: 'timeline',
    label: 'Timeline',
    description: 'Chronological events or milestones',
    icon: '⟶',
    defaultContent: {
      heading: 'Project Timeline',
      events: [
        { date: 'Q1 2025', title: 'Research & Discovery', description: 'Initial research phase and requirements gathering' },
        { date: 'Q2 2025', title: 'Design & Prototype', description: 'UX design, prototyping, and user testing' },
        { date: 'Q3 2025', title: 'Development', description: 'Core development and integration work' },
        { date: 'Q4 2025', title: 'Launch', description: 'Public release and market entry' },
      ],
    },
  },
  {
    type: 'two-column',
    label: 'Two Columns',
    description: 'Side-by-side comparison or explanation',
    icon: '▥',
    defaultContent: {
      heading: 'Comparison',
      left: { title: 'Before', body: 'Description of the previous state, approach, or method that was in use.' },
      right: { title: 'After', body: 'Description of the new state, approach, or improvement that has been made.' },
    },
  },
  {
    type: 'closing',
    label: 'Closing',
    description: 'Final slide with call-to-action',
    icon: '◉',
    defaultContent: {
      headline: 'Thank You',
      subtext: 'Questions, feedback, and next steps',
      cta_text: 'Let\'s discuss →',
    },
  },
];

export function getSlideTypeDefaults(type: SlideType): Record<string, any> {
  return SLIDE_TYPES.find(t => t.type === type)?.defaultContent || {};
}

export function getSlideTypeMeta(type: SlideType): SlideTypeMeta | undefined {
  return SLIDE_TYPES.find(t => t.type === type);
}

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  subtitle: string;
  slug: string | null;
  description: string;
  theme: string;
  status: string;
  cover_image_url: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface DeckSlide {
  id: string;
  deck_id: string;
  title: string;
  section_label: string;
  slide_type: SlideType;
  order_index: number;
  content: Record<string, any>;
  notes: string;
  created_at: string;
  updated_at: string;
}
