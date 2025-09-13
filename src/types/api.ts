import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  role: z.enum(['community', 'ngo', 'government', 'research']),
  name: z.string(),
  email: z.string().email(),
  wallet: z.string(),
  permissions: z.array(z.string()),
  createdAt: z.string(),
  lastLogin: z.string().optional(),
});

export const UserCreateSchema = UserSchema.omit({ id: true, createdAt: true });

// Project schemas
export const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  geofence: z.array(z.array(z.number())).optional(),
});

export const ProjectMetricsSchema = z.object({
  treesPlanted: z.number(),
  carbonTons: z.number(),
  areaRestored: z.number(),
  photos: z.array(z.string()),
  lastMeasurement: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  location: LocationSchema,
  type: z.enum(['mangrove', 'seagrass', 'coral', 'coastal']),
  status: z.enum(['planning', 'active', 'completed', 'suspended']),
  metrics: ProjectMetricsSchema,
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  verified: z.boolean(),
});

export const ProjectCreateSchema = ProjectSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  verified: true,
});

// Activity schemas
export const ActivityDataSchema = z.object({
  measurements: z.record(z.string(), z.any()),
  notes: z.string(),
  gps: LocationSchema,
  timestamp: z.string(),
  photos: z.array(z.string()).optional(),
});

export const ActivitySchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  type: z.enum(['planting', 'monitoring', 'measurement', 'verification']),
  data: ActivityDataSchema,
  verified: z.boolean(),
  createdAt: z.string(),
  verifiedBy: z.string().optional(),
  verifiedAt: z.string().optional(),
});

export const ActivityCreateSchema = ActivitySchema.omit({ 
  id: true, 
  createdAt: true, 
  verified: true,
  verifiedBy: true,
  verifiedAt: true 
});

// Credit schemas
export const CreditMetadataSchema = z.object({
  projectId: z.string(),
  projectName: z.string(),
  vintagePeriod: z.string(),
  methodology: z.string(),
});

export const CreditSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  amount: z.number(),
  tokenId: z.string(),
  txHash: z.string(),
  owner: z.string(),
  metadata: CreditMetadataSchema,
  createdAt: z.string(),
  status: z.enum(['minted', 'transferred', 'retired']),
});

export const CreditCreateSchema = z.object({
  projectId: z.string(),
  amount: z.number(),
  owner: z.string(),
});

// API Response schemas
export const ApiResponseSchema = z.object({
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
  error: z.string().optional(),
});

// Blockchain schemas
export const BlockchainTransactionSchema = z.object({
  txHash: z.string(),
  blockNumber: z.number(),
  status: z.enum(['pending', 'success', 'failed']),
  gasUsed: z.number(),
  timestamp: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.number(),
});

// Export types
export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectCreate = z.infer<typeof ProjectCreateSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type ActivityCreate = z.infer<typeof ActivityCreateSchema>;
export type Credit = z.infer<typeof CreditSchema>;
export type CreditCreate = z.infer<typeof CreditCreateSchema>;
export type ApiResponse<T = any> = z.infer<typeof ApiResponseSchema> & { data?: T };
export type PaginatedResponse<T = any> = z.infer<typeof PaginatedResponseSchema> & { data: T[] };
export type BlockchainTransaction = z.infer<typeof BlockchainTransactionSchema>;