import type { SectionId } from "@/lib/home-content";

export type UISlice = {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
};

export type HomeStore = UISlice;
