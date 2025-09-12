import { v4 as uuidv4 } from 'uuid';
import { db } from './db-browser';
import { 
  User, 
  Project, 
  Activity, 
  Credit, 
  ApiResponse, 
  PaginatedResponse,
  BlockchainTransaction,
  UserCreateSchema,
  ProjectCreateSchema,
  ActivityCreateSchema,
  CreditCreateSchema
} from '@/types/api';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication
class MockAuth {
  private static currentUser: User | null = null;
  private static currentToken: string | null = null;

  static async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(800);
    
    // Mock login validation
    const users = await db.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || password !== 'password') {
      return { error: 'Invalid credentials' };
    }

    const token = uuidv4();
    await db.createSession(user.id, token);
    
    this.currentUser = user;
    this.currentToken = token;
    
    // Store in localStorage for persistence
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));

    return {
      data: { user, token },
      message: 'Login successful'
    };
  }

  static async logout(): Promise<ApiResponse> {
    if (this.currentToken) {
      await db.deleteSession(this.currentToken);
    }
    
    this.currentUser = null;
    this.currentToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    
    return { message: 'Logged out successfully' };
  }

  static async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return { error: 'No authentication token' };
    }

    const session = await db.getSession(token);
    if (!session) {
      return { error: 'Invalid or expired token' };
    }

    const user = await db.getUserById(session.userId);
    if (!user) {
      return { error: 'User not found' };
    }

    this.currentUser = user;
    this.currentToken = token;
    
    return { data: user };
  }

  static isAuthenticated(): boolean {
    return !!this.currentToken && !!this.currentUser;
  }

  static getCurrentUserId(): string | null {
    return this.currentUser?.id || null;
  }

  static hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) || false;
  }

  static getCurrentUserData(): User | null {
    return this.currentUser;
  }
}

// API endpoints simulation
class MockAPI {
  // Auth endpoints
  static auth = {
    login: MockAuth.login.bind(MockAuth),
    logout: MockAuth.logout.bind(MockAuth),
    me: MockAuth.getCurrentUser.bind(MockAuth),
  };

  // Users endpoints
  static users = {
    async getAll(params?: { role?: string; page?: number; limit?: number }): Promise<PaginatedResponse<User>> {
      await delay();
      const filter = params?.role ? { role: params.role as any } : undefined;
      const users = await db.getUsers(filter);
      
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: users.slice(startIndex, endIndex),
        pagination: {
          page,
          limit,
          total: users.length,
          totalPages: Math.ceil(users.length / limit),
        },
      };
    },

    async getById(id: string): Promise<ApiResponse<User>> {
      await delay();
      const user = await db.getUserById(id);
      return user ? { data: user } : { error: 'User not found' };
    },

    async create(userData: any): Promise<ApiResponse<User>> {
      await delay();
      try {
        const validData = UserCreateSchema.parse(userData);
        const user = await db.createUser({
          ...validData,
          wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
        });
        return { data: user, message: 'User created successfully' };
      } catch (error) {
        return { error: 'Invalid user data' };
      }
    },

    async update(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
      await delay();
      const user = await db.updateUser(id, updates);
      return user ? { data: user, message: 'User updated successfully' } : { error: 'User not found' };
    },
  };

  // Projects endpoints
  static projects = {
    async getAll(params?: { 
      role?: string; 
      status?: string; 
      type?: string;
      location?: string;
      page?: number; 
      limit?: number; 
    }): Promise<PaginatedResponse<Project>> {
      await delay();
      const projects = await db.getProjects(params);
      
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: projects.slice(startIndex, endIndex),
        pagination: {
          page,
          limit,
          total: projects.length,
          totalPages: Math.ceil(projects.length / limit),
        },
      };
    },

    async getById(id: string): Promise<ApiResponse<Project>> {
      await delay();
      const project = await db.getProjectById(id);
      return project ? { data: project } : { error: 'Project not found' };
    },

    async create(projectData: any): Promise<ApiResponse<Project>> {
      await delay();
      try {
        const validData = ProjectCreateSchema.parse(projectData);
        const userId = MockAuth.getCurrentUserId();
        if (!userId) return { error: 'Authentication required' };

        const project = await db.createProject({
          ...validData,
          createdBy: userId,
        });
        return { data: project, message: 'Project created successfully' };
      } catch (error) {
        return { error: 'Invalid project data' };
      }
    },

    async update(id: string, updates: Partial<Project>): Promise<ApiResponse<Project>> {
      await delay();
      const project = await db.updateProject(id, updates);
      return project ? { data: project, message: 'Project updated successfully' } : { error: 'Project not found' };
    },

    async verify(id: string): Promise<ApiResponse<Project>> {
      await delay();
      if (!MockAuth.hasPermission('verify_project')) {
        return { error: 'Insufficient permissions' };
      }
      
      const project = await db.updateProject(id, { verified: true });
      return project ? { data: project, message: 'Project verified successfully' } : { error: 'Project not found' };
    },
  };

  // Activities endpoints
  static activities = {
    async getAll(params?: { projectId?: string; userId?: string }): Promise<ApiResponse<Activity[]>> {
      await delay();
      const activities = await db.getActivities(params);
      return { data: activities };
    },

    async create(activityData: any): Promise<ApiResponse<Activity>> {
      await delay();
      try {
        const validData = ActivityCreateSchema.parse(activityData);
        const userId = MockAuth.getCurrentUserId();
        if (!userId) return { error: 'Authentication required' };

        const activity = await db.createActivity({
          ...validData,
          userId,
        });
        return { data: activity, message: 'Activity recorded successfully' };
      } catch (error) {
        return { error: 'Invalid activity data' };
      }
    },
  };

  // Credits endpoints
  static credits = {
    async mint(data: { projectId: string; amount: number }): Promise<ApiResponse<{ credit: Credit; transaction: BlockchainTransaction }>> {
      await delay(1000); // Simulate blockchain delay
      
      const { projectId, amount } = data;
      const project = await db.getProjectById(projectId);
      if (!project) return { error: 'Project not found' };

      const userId = MockAuth.getCurrentUserId();
      if (!userId) return { error: 'Authentication required' };

      const user = await db.getUserById(userId);
      if (!user) return { error: 'User not found' };

      const credit = await db.createCredit({
        projectId,
        amount,
        owner: user.wallet,
        metadata: {
          projectId,
          projectName: project.name,
          vintagePeriod: new Date().getFullYear().toString(),
          methodology: 'VCS-Verified Carbon Standard',
        },
      });

      const transaction: BlockchainTransaction = {
        txHash: credit.txHash,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        status: 'success',
        gasUsed: Math.floor(Math.random() * 100000) + 50000,
        timestamp: new Date().toISOString(),
        from: '0x0000000000000000000000000000000000000000',
        to: user.wallet,
        value: amount,
      };

      return {
        data: { credit, transaction },
        message: 'Carbon credits minted successfully',
      };
    },

    async getPortfolio(wallet: string): Promise<ApiResponse<Credit[]>> {
      await delay();
      const credits = await db.getCredits({ owner: wallet });
      return { data: credits };
    },

    async transfer(data: { creditId: string; to: string; amount: number }): Promise<ApiResponse<BlockchainTransaction>> {
      await delay(800);
      
      const transaction: BlockchainTransaction = {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        status: 'success',
        gasUsed: Math.floor(Math.random() * 50000) + 25000,
        timestamp: new Date().toISOString(),
        from: MockAuth.getCurrentUserData()?.wallet || '0x',
        to: data.to,
        value: data.amount,
      };

      return {
        data: transaction,
        message: 'Credits transferred successfully',
      };
    },
  };

  // Maps endpoints
  static maps = {
    async getProjectsGeoJSON(): Promise<ApiResponse<any>> {
      await delay();
      const projects = await db.getProjects();
      
      const geoJSON = {
        type: 'FeatureCollection',
        features: projects.map(project => ({
          type: 'Feature',
          id: project.id,
          properties: {
            id: project.id,
            name: project.name,
            type: project.type,
            status: project.status,
            treesPlanted: project.metrics.treesPlanted,
            carbonTons: project.metrics.carbonTons,
          },
          geometry: {
            type: 'Point',
            coordinates: [project.location.lng, project.location.lat],
          },
        })),
      };

      return { data: geoJSON };
    },
  };

  // Verification endpoints
  static verification = {
    async approve(data: { activityId: string; notes?: string }): Promise<ApiResponse<{ transaction: BlockchainTransaction }>> {
      await delay(1200);
      
      if (!MockAuth.hasPermission('verify_activity')) {
        return { error: 'Insufficient permissions' };
      }

      const transaction: BlockchainTransaction = {
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        status: 'success',
        gasUsed: Math.floor(Math.random() * 75000) + 40000,
        timestamp: new Date().toISOString(),
        from: MockAuth.getCurrentUserData()?.wallet || '0x',
        to: '0xVerificationContract',
        value: 0,
      };

      return {
        data: { transaction },
        message: 'Activity verified and recorded on blockchain',
      };
    },

    async getLogs(projectId: string): Promise<ApiResponse<any[]>> {
      await delay();
      
      // Mock verification logs
      const logs = [
        {
          id: '1',
          activityId: 'activity-1',
          verifiedBy: 'user-2',
          verifiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          notes: 'Initial planting verification completed',
        },
        {
          id: '2',
          activityId: 'activity-2',
          verifiedBy: 'user-3',
          verifiedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          notes: 'Growth monitoring data verified',
        },
      ];

      return { data: logs };
    },
  };

  // Reports endpoints
  static reports = {
    async export(params: { type: string; projectId?: string; format?: string }): Promise<ApiResponse<any>> {
      await delay(2000); // Simulate report generation
      
      if (params.type === 'pdf') {
        // Mock PDF URL
        return {
          data: {
            url: '/reports/project-report.pdf',
            filename: `project-report-${params.projectId || 'all'}-${Date.now()}.pdf`,
          },
          message: 'Report generated successfully',
        };
      }

      // Mock CSV data
      return {
        data: {
          csv: 'Project Name,Trees Planted,Carbon Sequestered,Status\nSundarbans Revival,1247,89.2,Active\n',
          filename: `project-data-${Date.now()}.csv`,
        },
        message: 'Data exported successfully',
      };
    },
  };
}

export { MockAPI, MockAuth };