import { Resource, Project, Allocation } from "./types";

// Initial Mock Data
const MOCK_RESOURCES: Resource[] = [
  {
    id: "RES-001",
    name: "Alex Chen",
    email: "alex.chen@rbm.com",
    dateOfJoining: "2023-01-15",
    contactNumber: "+1 (555) 0123",
    address: "123 Tech Blvd",
    city: "San Francisco",
    country: "USA",
    primarySkill: "React",
    secondarySkills: ["Node.js", "TypeScript"],
    totalExperience: 5,
    availability: "50%",
    status: "Active",
    type: "RBM"
  },
  {
    id: "RES-002",
    name: "Sarah Jones",
    email: "sarah.j@rbm.com",
    dateOfJoining: "2022-06-10",
    contactNumber: "+1 (555) 0124",
    address: "456 Innovation Dr",
    city: "New York",
    country: "USA",
    primarySkill: "Python",
    secondarySkills: ["Django", "AWS"],
    totalExperience: 8,
    availability: "Bench",
    status: "Active",
    type: "RBM Contractor"
  },
  {
    id: "RES-003",
    name: "Michael Ross",
    email: "m.ross@rbm.com",
    dateOfJoining: "2021-11-01",
    contactNumber: "+1 (555) 0125",
    address: "789 Data Way",
    city: "London",
    country: "UK",
    primarySkill: "Project Management",
    secondarySkills: ["Agile", "Scrum"],
    totalExperience: 12,
    availability: "100%",
    status: "Active",
    type: "RBM"
  }
];

const MOCK_PROJECTS: Project[] = [
  {
    id: "PROJ-001",
    name: "Alpha Banking App",
    clientName: "Alpha Bank",
    status: "Active",
    startDate: "2024-01-01",
    clientProjectManager: "David Smith",
    rbmProjectManager: "Michael Ross",
    description: "Modernization of legacy banking application."
  },
  {
    id: "PROJ-002",
    name: "Omega E-commerce",
    clientName: "Omega Retail",
    status: "On Hold",
    startDate: "2023-09-01",
    clientProjectManager: "Lisa Wong",
    rbmProjectManager: "Michael Ross",
    description: "Global e-commerce platform rollout."
  }
];

const MOCK_ALLOCATIONS: Allocation[] = [
  {
    id: "ALLOC-001",
    resourceId: "RES-001",
    projectId: "PROJ-001",
    role: "Senior Frontend Dev",
    startDate: "2024-01-01",
    billingStartDate: "2024-01-01",
    percentage: 50,
    isBillable: true,
    timesheetRequired: true,
    billingRate: 85,
    billingProject: true
  }
];

// Simple in-memory store simulation
class Store {
  private resources: Resource[] = [...MOCK_RESOURCES];
  private projects: Project[] = [...MOCK_PROJECTS];
  private allocations: Allocation[] = [...MOCK_ALLOCATIONS];

  getResources() { return this.resources; }
  getProjects() { return this.projects; }
  getAllocations() { return this.allocations; }

  addResource(resource: Omit<Resource, "id">) {
    const newResource = { ...resource, id: `RES-${String(this.resources.length + 1).padStart(3, '0')}` };
    this.resources = [newResource, ...this.resources];
    return newResource;
  }

  updateResource(id: string, data: Partial<Resource>) {
    this.resources = this.resources.map(r => r.id === id ? { ...r, ...data } : r);
  }

  addProject(project: Omit<Project, "id">) {
    const newProject = { ...project, id: `PROJ-${String(this.projects.length + 1).padStart(3, '0')}` };
    this.projects = [newProject, ...this.projects];
    return newProject;
  }

  updateProject(id: string, data: Partial<Project>) {
    this.projects = this.projects.map(p => p.id === id ? { ...p, ...data } : p);
  }

  addAllocation(allocation: Omit<Allocation, "id">) {
    const newAllocation = { ...allocation, id: `ALLOC-${String(this.allocations.length + 1).padStart(3, '0')}` };
    this.allocations = [newAllocation, ...this.allocations];
    return newAllocation;
  }
  
  deleteResource(id: string) {
    this.resources = this.resources.filter(r => r.id !== id);
    this.allocations = this.allocations.filter(a => a.resourceId !== id);
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.allocations = this.allocations.filter(a => a.projectId !== id);
  }

  getStats() {
    return [
      { label: "Total Resources", value: this.resources.length, change: "+2", trend: "up" as const },
      { label: "Active Projects", value: this.projects.filter(p => p.status === "Active").length, change: "0", trend: "neutral" as const },
      { label: "Benched Resources", value: this.resources.filter(r => r.availability === "Bench").length, change: "-1", trend: "down" as const },
      { label: "Utilization", value: "85%", change: "+5%", trend: "up" as const }
    ];
  }
}

export const db = new Store();
