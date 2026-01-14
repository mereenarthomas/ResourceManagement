export type AvailabilityStatus = "100%" | "50%" | "Bench";
export type EmploymentStatus = "Active" | "On Leave" | "Exited";
export type ResourceType = "RBM" | "RBM Contractor" | "Non-RBM";

export interface Resource {
  id: string;
  name: string;
  email: string;
  dateOfJoining: string;
  contactNumber: string;
  address: string;
  city: string;
  country: string;
  primarySkill: string;
  secondarySkills: string[];
  totalExperience: number;
  availability: AvailabilityStatus;
  status: EmploymentStatus;
  type: ResourceType;
  clientEmail?: string;
}

export type ProjectStatus = "Active" | "On Hold" | "Closed";

export interface Project {
  id: string;
  name: string;
  clientName: string;
  status: ProjectStatus;
  startDate: string;
  clientProjectManager?: string;
  rbmProjectManager?: string;
  description?: string;
}

export interface Allocation {
  id: string;
  resourceId: string;
  projectId: string;
  role: string;
  startDate: string;
  endDate?: string;
  billingStartDate: string;
  billingEndDate?: string;
  percentage: number;
  isBillable: boolean;
  timesheetRequired: boolean;
  billingRate?: number;
  billingProject: boolean;
  notes?: string;
}

export interface Stat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}
