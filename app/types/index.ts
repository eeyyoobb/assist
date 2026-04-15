// Mirrors Prisma model structure
export interface SocialMediaReport {
  mediaName: string;
  totalPost: number;
  totalView: number;
  totalEngagement: number;
  followers: number;
}

export interface ConsultingEntry {
  name: string;
  phoneNumber: string;
}

export interface OfficeActivityReport {
  task: "equb" | "key";
  consulting: ConsultingEntry[];
}

export interface ReportFormData {
  company: string;
  staffRole: "media_manager" | "sales";
  reportType: "social_media" | "office_activity";
  socialMedia?: SocialMediaReport;
  officeActivity?: OfficeActivityReport;
}

export interface ReportPayload extends ReportFormData {
  userId: string;
  userName: string;
}
