// Browser-compatible database simulation using localStorage
import { User, Project, Activity, Credit } from '@/types/api';

interface DatabaseSchema {
  users: User[];
  projects: Project[];
  activities: Activity[];
  credits: Credit[];
  sessions: Record<string, { userId: string; token: string; expiresAt: string }>;
}

class BrowserMockDatabase {
  private readonly DB_KEY = 'blue_carbon_db';

  private getData(): DatabaseSchema {
    const stored = localStorage.getItem(this.DB_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize with default data
    const defaultData: DatabaseSchema = {
      users: [],
      projects: [],
      activities: [],
      credits: [],
      sessions: {},
    };
    
    this.saveData(defaultData);
    this.seedDatabase();
    return this.getData();
  }

  private saveData(data: DatabaseSchema) {
    localStorage.setItem(this.DB_KEY, JSON.stringify(data));
  }

  private seedDatabase() {
    const mockUsers: User[] = [
      {
        id: 'user-1',
        role: 'community',
        name: 'Priya Sharma',
        email: 'priya@community.local',
        wallet: '0x1234567890abcdef1234567890abcdef12345678',
        permissions: ['create_activity', 'view_projects'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-2',
        role: 'ngo',
        name: 'Dr. Raj Patel',
        email: 'raj@ngo.local',
        wallet: '0xabcdef1234567890abcdef1234567890abcdef12',
        permissions: ['create_project', 'verify_activity', 'view_all'],
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-3',
        role: 'government',
        name: 'Anita Singh',
        email: 'anita@gov.local',
        wallet: '0x5678901234abcdef5678901234abcdef56789012',
        permissions: ['view_all', 'verify_project', 'generate_reports'],
        createdAt: new Date().toISOString(),
      },
    ];

    const mockProjects: Project[] = [
      {
        id: 'project-1',
        name: 'Sundarbans Mangrove Revival',
        description: 'Restoration of mangrove ecosystems in the Sundarbans delta',
        location: {
          lat: 21.9497,
          lng: 89.1833,
          geofence: [[89.1, 21.9], [89.2, 21.9], [89.2, 22.0], [89.1, 22.0]],
        },
        type: 'mangrove',
        status: 'active',
        metrics: {
          treesPlanted: 1247,
          carbonTons: 89.2,
          areaRestored: 15.3,
          photos: ['photo1.jpg', 'photo2.jpg'],
        },
        createdBy: 'user-2',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        verified: true,
      },
      {
        id: 'project-2',
        name: 'Goa Seagrass Conservation',
        description: 'Protecting and restoring seagrass meadows along Goa coast',
        location: {
          lat: 15.2993,
          lng: 74.1240,
        },
        type: 'seagrass',
        status: 'planning',
        metrics: {
          treesPlanted: 0,
          carbonTons: 0,
          areaRestored: 0,
          photos: [],
        },
        createdBy: 'user-2',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        verified: false,
      },
    ];

    const data = this.getData();
    data.users = mockUsers;
    data.projects = mockProjects;
    this.saveData(data);
  }

  // Users
  async getUsers(filter?: Partial<User>) {
    const data = this.getData();
    let users = data.users;
    
    if (filter) {
      users = users.filter(user => {
        return Object.entries(filter).every(([key, value]) => 
          user[key as keyof User] === value
        );
      });
    }
    
    return users;
  }

  async getUserById(id: string) {
    const data = this.getData();
    return data.users.find(user => user.id === id);
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>) {
    const data = this.getData();
    const user: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    data.users.push(user);
    this.saveData(data);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>) {
    const data = this.getData();
    const index = data.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    data.users[index] = { ...data.users[index], ...updates };
    this.saveData(data);
    return data.users[index];
  }

  // Projects
  async getProjects(filter?: any) {
    const data = this.getData();
    let projects = data.projects;
    
    if (filter) {
      if (filter.status) {
        projects = projects.filter(p => p.status === filter.status);
      }
      if (filter.type) {
        projects = projects.filter(p => p.type === filter.type);
      }
      if (filter.createdBy) {
        projects = projects.filter(p => p.createdBy === filter.createdBy);
      }
    }
    
    return projects;
  }

  async getProjectById(id: string) {
    const data = this.getData();
    return data.projects.find(project => project.id === id);
  }

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'verified'>) {
    const data = this.getData();
    const project: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verified: false,
    };
    
    data.projects.push(project);
    this.saveData(data);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>) {
    const data = this.getData();
    const index = data.projects.findIndex(project => project.id === id);
    if (index === -1) return null;
    
    data.projects[index] = { 
      ...data.projects[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveData(data);
    return data.projects[index];
  }

  // Activities
  async getActivities(filter?: any) {
    const data = this.getData();
    let activities = data.activities;
    
    if (filter?.projectId) {
      activities = activities.filter(a => a.projectId === filter.projectId);
    }
    if (filter?.userId) {
      activities = activities.filter(a => a.userId === filter.userId);
    }
    
    return activities;
  }

  async createActivity(activityData: Omit<Activity, 'id' | 'createdAt' | 'verified'>) {
    const data = this.getData();
    const activity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verified: false,
    };
    
    data.activities.push(activity);
    this.saveData(data);
    return activity;
  }

  // Credits
  async getCredits(filter?: any) {
    const data = this.getData();
    let credits = data.credits;
    
    if (filter?.owner) {
      credits = credits.filter(c => c.owner === filter.owner);
    }
    if (filter?.projectId) {
      credits = credits.filter(c => c.projectId === filter.projectId);
    }
    
    return credits;
  }

  async createCredit(creditData: Omit<Credit, 'id' | 'createdAt' | 'tokenId' | 'txHash' | 'status'>) {
    const data = this.getData();
    const credit: Credit = {
      ...creditData,
      id: `credit-${Date.now()}`,
      tokenId: `token-${Date.now()}`,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      createdAt: new Date().toISOString(),
      status: 'minted',
    };
    
    data.credits.push(credit);
    this.saveData(data);
    return credit;
  }

  // Sessions
  async createSession(userId: string, token: string) {
    const data = this.getData();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    data.sessions[token] = { userId, token, expiresAt };
    this.saveData(data);
  }

  async getSession(token: string) {
    const data = this.getData();
    const session = data.sessions[token];
    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }
    return session;
  }

  async deleteSession(token: string) {
    const data = this.getData();
    delete data.sessions[token];
    this.saveData(data);
  }
}

export const db = new BrowserMockDatabase();