export type Role = "DONOR" | "ORGANIZATION";

export type OrgCategory = "NGO" | "GOVERNMENT" | "OLD_AGE_HOME" | "ANIMAL_SHELTER";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type DonationStatus = "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED";

export interface Requirement {
  id: string;
  orgId: string;
  itemName: string;
  category: string;
  requiredQty: number;
  availableQty: number;
  unit: string;
  priority: Priority;
  status: "OPEN" | "FULFILLED" | "PARTIAL";
  lastUpdated: string;
}

export interface Organization {
  id: string;
  name: string;
  category: OrgCategory;
  verified: boolean;
  logoUrl: string;
  coverUrl: string;
  about: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  coordinatorName: string;
  phone: string;
  email: string;
  website: string;
  stats: {
    students: number;
    teachers: number;
    staff: number;
    hostelAvailable: boolean;
    currentBeneficiaries: number;
    servicesOffered: string[];
  };
  impact: {
    needsFulfilledPct: number;
    mealsSupported: number;
    studentsBenefited: number;
    totalDonations: number;
  };
  urgent: boolean;
  distanceKm: number;
  gallery: string[];
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  orgId: string;
  orgName: string;
  date: string;
  items: { name: string; qty: number; unit: string }[];
  status: DonationStatus;
  approvedBy?: string;
  certificateAvailable: boolean;
  badgeEarned?: string;
}

export type BadgeLevel = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedOn: string;
}

export interface DonorProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  impactScore: number;
  level: BadgeLevel;
  badges: Badge[];
  volunteerHours: number;
}
