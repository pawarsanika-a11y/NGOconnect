import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const categoryLabels: Record<string, string> = {
  NGO: "NGO",
  GOVERNMENT: "Government Institution",
  OLD_AGE_HOME: "Old Age Home",
  ANIMAL_SHELTER: "Animal Shelter / Gaushala",
};

export const priorityStyles: Record<string, string> = {
  CRITICAL: "bg-rose-50 text-rose-600",
  HIGH: "bg-accent-50 text-accent-600",
  MEDIUM: "bg-sky-50 text-sky-600",
  LOW: "bg-primary-50 text-primary-700",
};
