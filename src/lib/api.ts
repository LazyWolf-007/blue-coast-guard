import { useState, useEffect } from 'react';
import { MockAPI, MockAuth } from './mockApi';
import { toast } from '@/hooks/use-toast';

// API client with error handling and token management
class ApiClient {
  private baseURL = '/api'; // For future real API integration
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async handleResponse<T>(response: Promise<any>): Promise<T> {
    try {
      const result = await response;
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        throw new Error(result.error);
      }

      if (result.message) {
        toast({
          title: "Success",
          description: result.message,
        });
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const result = await this.handleResponse(MockAPI.auth.login(email, password));
    if ((result as any).data?.token) {
      this.token = (result as any).data.token;
    }
    return result;
  }

  async logout() {
    const result = await this.handleResponse(MockAPI.auth.logout());
    this.token = null;
    return result;
  }

  async getCurrentUser() {
    return this.handleResponse(MockAPI.auth.me());
  }

  // Projects methods
  async getProjects(params?: any) {
    return this.handleResponse(MockAPI.projects.getAll(params));
  }

  async getProject(id: string) {
    return this.handleResponse(MockAPI.projects.getById(id));
  }

  async createProject(data: any) {
    return this.handleResponse(MockAPI.projects.create(data));
  }

  async updateProject(id: string, data: any) {
    return this.handleResponse(MockAPI.projects.update(id, data));
  }

  async verifyProject(id: string) {
    return this.handleResponse(MockAPI.projects.verify(id));
  }

  // Activities methods
  async getActivities(params?: any) {
    return this.handleResponse(MockAPI.activities.getAll(params));
  }

  async createActivity(data: any) {
    return this.handleResponse(MockAPI.activities.create(data));
  }

  // Credits methods
  async mintCredits(data: { projectId: string; amount: number }) {
    return this.handleResponse(MockAPI.credits.mint(data));
  }

  async getCreditsPortfolio(wallet: string) {
    return this.handleResponse(MockAPI.credits.getPortfolio(wallet));
  }

  async transferCredits(data: { creditId: string; to: string; amount: number }) {
    return this.handleResponse(MockAPI.credits.transfer(data));
  }

  // Users methods
  async getUsers(params?: any) {
    return this.handleResponse(MockAPI.users.getAll(params));
  }

  async createUser(data: any) {
    return this.handleResponse(MockAPI.users.create(data));
  }

  async updateUser(id: string, data: any) {
    return this.handleResponse(MockAPI.users.update(id, data));
  }

  // Verification methods
  async verifyActivity(data: { activityId: string; notes?: string }) {
    return this.handleResponse(MockAPI.verification.approve(data));
  }

  async getVerificationLogs(projectId: string) {
    return this.handleResponse(MockAPI.verification.getLogs(projectId));
  }

  // Maps methods
  async getMapData() {
    return this.handleResponse(MockAPI.maps.getProjectsGeoJSON());
  }

  // Reports methods
  async exportReport(params: { type: string; projectId?: string; format?: string }) {
    return this.handleResponse(MockAPI.reports.export(params));
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

export const api = new ApiClient();

// Offline support utilities
class OfflineQueue {
  private queue: any[] = [];
  private readonly QUEUE_KEY = 'api_offline_queue';

  constructor() {
    this.loadQueue();
    this.setupOnlineListener();
  }

  private loadQueue() {
    const stored = localStorage.getItem(this.QUEUE_KEY);
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }

  private saveQueue() {
    localStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.queue));
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      this.processQueue();
    });
  }

  add(operation: any) {
    this.queue.push({
      ...operation,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9),
    });
    this.saveQueue();
  }

  async processQueue() {
    if (this.queue.length === 0) return;

    const operations = [...this.queue];
    this.queue = [];
    this.saveQueue();

    for (const operation of operations) {
      try {
        // Process queued operations
        console.log('Processing offline operation:', operation);
        // In a real implementation, you would replay the API calls here
      } catch (error) {
        console.error('Failed to process offline operation:', error);
        // Re-queue failed operations
        this.queue.push(operation);
      }
    }

    this.saveQueue();
  }

  getQueueLength() {
    return this.queue.length;
  }
}

export const offlineQueue = new OfflineQueue();

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}