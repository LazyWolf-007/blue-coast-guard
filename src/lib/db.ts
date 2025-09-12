import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { User, Project, Activity, Credit } from '@/types/api';

interface DatabaseSchema {
  users: User[];
  projects: Project[];
  activities: Activity[];
  credits: Credit[];
  sessions: Record<string, { userId: string; token: string; expiresAt: string }>;
}

class MockDatabase {
  private db: Low<DatabaseSchema>;

  constructor() {
    const adapter = new JSONFile<DatabaseSchema>('data/db.json');
    this.db = new Low(adapter, {
      users: [],
      projects: [],
      activities: [],
      credits: [],
      sessions: {},
    });
    this.init();
  }

  private async init() {
    await this.db.read();
    
    // Initialize with mock data if empty
    if (!this.db.data.users.length) {
      await this.seedDatabase();
    }
  }

  private async seedDatabase() {
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

    this.db.data.users = mockUsers;
    this.db.data.projects = mockProjects;
    await this.db.write();
  }

  // Users
  async getUsers(filter?: Partial<User>) {
    await this.db.read();
    let users = this.db.data.users;
    
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
    await this.db.read();
    return this.db.data.users.find(user => user.id === id);
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>) {
    await this.db.read();
    const user: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    this.db.data.users.push(user);
    await this.db.write();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>) {
    await this.db.read();
    const index = this.db.data.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    this.db.data.users[index] = { ...this.db.data.users[index], ...updates };
    await this.db.write();
    return this.db.data.users[index];
  }

  // Projects
  async getProjects(filter?: any) {
    await this.db.read();
    let projects = this.db.data.projects;
    
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
    await this.db.read();
    return this.db.data.projects.find(project => project.id === id);
  }

  async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'verified'>) {
    await this.db.read();
    const project: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verified: false,
    };
    
    this.db.data.projects.push(project);
    await this.db.write();
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>) {
    await this.db.read();
    const index = this.db.data.projects.findIndex(project => project.id === id);
    if (index === -1) return null;
    
    this.db.data.projects[index] = { 
      ...this.db.data.projects[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await this.db.write();
    return this.db.data.projects[index];
  }

  // Activities
  async getActivities(filter?: any) {
    await this.db.read();
    let activities = this.db.data.activities;
    
    if (filter?.projectId) {
      activities = activities.filter(a => a.projectId === filter.projectId);
    }
    if (filter?.userId) {
      activities = activities.filter(a => a.userId === filter.userId);
    }
    
    return activities;
  }

  async createActivity(activityData: Omit<Activity, 'id' | 'createdAt' | 'verified'>) {
    await this.db.read();
    const activity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verified: false,
    };
    
    this.db.data.activities.push(activity);
    await this.db.write();
    return activity;
  }

  // Credits
  async getCredits(filter?: any) {
    await this.db.read();
    let credits = this.db.data.credits;
    
    if (filter?.owner) {
      credits = credits.filter(c => c.owner === filter.owner);
    }
    if (filter?.projectId) {
      credits = credits.filter(c => c.projectId === filter.projectId);
    }
    
    return credits;
  }

  async createCredit(creditData: Omit<Credit, 'id' | 'createdAt' | 'tokenId' | 'txHash' | 'status'>) {
    await this.db.read();
    const credit: Credit = {
      ...creditData,
      id: `credit-${Date.now()}`,
      tokenId: `token-${Date.now()}`,
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      createdAt: new Date().toISOString(),
      status: 'minted',
    };
    
    this.db.data.credits.push(credit);
    await this.db.write();
    return credit;
  }

  // Sessions
  async createSession(userId: string, token: string) {
    await this.db.read();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    this.db.data.sessions[token] = { userId, token, expiresAt };
    await this.db.write();
  }

  async getSession(token: string) {
    await this.db.read();
    const session = this.db.data.sessions[token];
    if (!session || new Date(session.expiresAt) < new Date()) {
      return null;
    }
    return session;
  }

  async deleteSession(token: string) {
    await this.db.read();
    delete this.db.data.sessions[token];
    await this.db.write();
  }
}

export const db = new MockDatabase();