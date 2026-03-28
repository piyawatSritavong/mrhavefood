import type { SectionId } from "@/lib/home-content";

export type UISlice = {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
};

export type HomeStore = UISlice;
