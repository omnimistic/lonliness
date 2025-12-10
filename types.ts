export interface ChartDataPoint {
  year: string;
  value: number;
  label: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MapGroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface GroundingMetadata {
  groundingChunks?: MapGroundingChunk[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  COMPANION = 'COMPANION',
  COMMUNITY = 'COMMUNITY'
}