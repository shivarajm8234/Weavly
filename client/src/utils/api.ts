const API_BASE = 'http://localhost:3001/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(body || res.statusText, res.status);
  }

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return res.json();
  }
  return res.text() as unknown as T;
}

export const api = {
  // Projects
  listProjects: () => request<ProjectSummary[]>('/projects'),
  getProject: (id: string) => request<ProjectData>(`/projects/${id}`),
  createProject: (data: CreateProjectPayload) =>
    request<ProjectData>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: Partial<ProjectData>) =>
    request<ProjectData>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),

  // Generation
  generateDesign: (id: string, params: GenerateParams) =>
    request<GenerateResult>(`/projects/${id}/generate`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  generateRegion: (id: string, region: string, params: GenerateParams) =>
    request<GenerateResult>(`/projects/${id}/generate/${region}`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // Export
  exportProject: (id: string, format: string) =>
    request<ExportResult>(`/projects/${id}/export`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    }),

  // Motifs
  listMotifs: () => request<MotifData[]>('/motifs'),
};

// Lightweight types for API payloads (full types imported where needed)
interface ProjectSummary {
  id: string;
  name: string;
  designerName: string;
  collectionName: string;
  sareeType: string;
  gridWidth: number;
  gridHeight: number;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

interface ProjectData {
  [key: string]: unknown;
}

interface CreateProjectPayload {
  [key: string]: unknown;
}

interface GenerateParams {
  [key: string]: unknown;
}

interface GenerateResult {
  success: boolean;
  [key: string]: unknown;
}

interface ExportResult {
  success: boolean;
  filename?: string;
  data?: string;
}

interface MotifData {
  [key: string]: unknown;
}

export type { ProjectSummary, ApiError };
