import { Users, BarChart3, MessageCircleHeart, MapPin } from "lucide-react";

export const NAV_ITEMS = [
  { id: 'DASHBOARD', label: 'Insights', icon: BarChart3 },
  { id: 'COMPANION', label: 'AI Companion', icon: MessageCircleHeart },
  { id: 'COMMUNITY', label: 'Find Community', icon: MapPin },
];

export const INITIAL_SYSTEM_PROMPT = `
You are a compassionate and knowledgeable AI assistant dedicated to helping people combat the loneliness epidemic. 
Your tone should be empathetic, understanding, and encouraging, but grounded in psychological science.
When asked about loneliness, provide insights into its modern causes (digital isolation, urbanization, remote work).
Always suggest actionable, small steps to build connections.
`;
