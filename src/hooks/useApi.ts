import { useState, useEffect } from 'react';
import { MockAPI } from '@/lib/mockApi';
import { ApiResponse, PaginatedResponse } from '@/types/api';

// Generic API hook for simple data fetching
export function useApiData<T>(
  apiCall: () => Promise<ApiResponse<T> | PaginatedResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiCall();
        
        if (response.error) {
          setError(response.error);
        } else {
          setData('data' in response ? response.data : null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.error) {
        setError(response.error);
      } else {
        setData('data' in response ? response.data : null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

// Projects hooks
export function useProjects(params?: any) {
  return useApiData(
    () => MockAPI.projects.getAll(params),
    [JSON.stringify(params)]
  );
}

export function useProject(id: string) {
  return useApiData(
    () => MockAPI.projects.getById(id),
    [id]
  );
}

// Activities hooks
export function useActivities(params?: any) {
  return useApiData(
    () => MockAPI.activities.getAll(params),
    [JSON.stringify(params)]
  );
}

// Credits hooks
export function useCredits(wallet?: string) {
  return useApiData(
    () => wallet ? MockAPI.credits.getPortfolio(wallet) : Promise.resolve({ data: [] }),
    [wallet]
  );
}

// Users hooks
export function useUsers(params?: any) {
  return useApiData(
    () => MockAPI.users.getAll(params),
    [JSON.stringify(params)]
  );
}

// Auth hooks
export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await MockAPI.auth.me();
        if (response.error) {
          setError(response.error);
        } else {
          setUser(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth check failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading, error };
}

// Mutation hooks for creating/updating data
export function useCreateProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (projectData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await MockAPI.projects.create(projectData);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createProject, loading, error };
}

export function useCreateActivity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createActivity = async (activityData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await MockAPI.activities.create(activityData);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create activity');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createActivity, loading, error };
}

export function useMintCredits() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintCredits = async (data: { projectId: string; amount: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await MockAPI.credits.mint(data);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint credits');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mintCredits, loading, error };
}

export function useVerifyActivity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyActivity = async (data: { activityId: string; notes?: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await MockAPI.verification.approve(data);
      if (response.error) {
        setError(response.error);
        return null;
      }
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify activity');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { verifyActivity, loading, error };
}

// Map data hook
export function useMapData() {
  return useApiData(() => MockAPI.maps.getProjectsGeoJSON());
}