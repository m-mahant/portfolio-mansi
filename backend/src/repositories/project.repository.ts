import { Query } from 'firebase-admin/firestore';
import { db, isFirebaseInitialized } from '../config/firebase.config';
import { Project, PublishStatus } from '../types/database.types';
import { normalizeForFirestore } from '../utils/firestore.utils';

export interface ProjectListResult {
  items: Project[];
  total: number;
}

// Memory fallback store for projects when Firestore is uninitialized or unreachable in test environment.
let inMemoryProjects: Project[] = [];

export function clearInMemoryProjects(): void {
  inMemoryProjects = [];
}

// Repository for querying and mutating software development projects in Firestore.
export class ProjectRepository {
  // Retrieves published projects for public display.
  async getPublishedProjects(options: {
    featured?: boolean;
    page: number;
    limit: number;
  }): Promise<ProjectListResult> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = inMemoryProjects.filter((p) => p.status === 'published');
      if (options.featured === true) {
        filtered = filtered.filter((p) => p.isFeatured);
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }

    try {
      let query: Query = db
        .collection('projects')
        .where('status', '==', 'published');

      if (options.featured === true) {
        query = query.where('isFeatured', '==', true);
      }

      const snapshot = await query.get();
      let allDocs: Project[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, 'id'>),
      }));

      allDocs.sort((a, b) => a.displayOrder - b.displayOrder);

      const total = allDocs.length;
      if (total === 0) {
        return { items: [], total: 0 };
      }

      const offset = (options.page - 1) * options.limit;
      const items = allDocs.slice(offset, offset + options.limit);

      return { items, total };
    } catch {
      let filtered = inMemoryProjects.filter((p) => p.status === 'published');
      if (options.featured === true) {
        filtered = filtered.filter((p) => p.isFeatured);
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }
  }

  // Retrieves a single published project by its unique slug.
  async getPublishedProjectBySlug(slug: string): Promise<Project | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryProjects.find((p) => p.slug === slug && p.status === 'published') || null;
    }

    try {
      const snapshot = await db
        .collection('projects')
        .where('slug', '==', slug)
        .where('status', '==', 'published')
        .limit(1)
        .get();

      if (snapshot.empty) {
        return inMemoryProjects.find((p) => p.slug === slug && p.status === 'published') || null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...(doc.data() as Omit<Project, 'id'>),
      };
    } catch {
      return inMemoryProjects.find((p) => p.slug === slug && p.status === 'published') || null;
    }
  }

  // Retrieves all projects for administrative management with filtering and pagination.
  async getAllProjectsAdmin(options: {
    status?: PublishStatus;
    featured?: boolean;
    page: number;
    limit: number;
  }): Promise<ProjectListResult> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = [...inMemoryProjects];
      if (options.status) {
        filtered = filtered.filter((p) => p.status === options.status);
      }
      if (options.featured !== undefined) {
        filtered = filtered.filter((p) => p.isFeatured === options.featured);
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }

    try {
      let query: Query = db.collection('projects');
      if (options.status) {
        query = query.where('status', '==', options.status);
      }
      if (options.featured !== undefined) {
        query = query.where('isFeatured', '==', options.featured);
      }

      const snapshot = await query.get();
      const allDocs: Project[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, 'id'>),
      }));

      allDocs.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = allDocs.length;

      const offset = (options.page - 1) * options.limit;
      const items = allDocs.slice(offset, offset + options.limit);

      return { items, total };
    } catch {
      let filtered = [...inMemoryProjects];
      if (options.status) {
        filtered = filtered.filter((p) => p.status === options.status);
      }
      if (options.featured !== undefined) {
        filtered = filtered.filter((p) => p.isFeatured === options.featured);
      }
      filtered.sort((a, b) => a.displayOrder - b.displayOrder);
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }
  }

  // Retrieves a single project by document ID regardless of publication status.
  async getProjectById(id: string): Promise<Project | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryProjects.find((p) => p.id === id) || null;
    }

    try {
      const docRef = db.collection('projects').doc(id);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        return inMemoryProjects.find((p) => p.id === id) || null;
      }
      return {
        id: snapshot.id,
        ...(snapshot.data() as Omit<Project, 'id'>),
      };
    } catch {
      return inMemoryProjects.find((p) => p.id === id) || null;
    }
  }

  // Retrieves any project matching a specific slug regardless of status.
  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryProjects.find((p) => p.slug === slug) || null;
    }

    try {
      const snapshot = await db
        .collection('projects')
        .where('slug', '==', slug)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return inMemoryProjects.find((p) => p.slug === slug) || null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...(doc.data() as Omit<Project, 'id'>),
      };
    } catch {
      return inMemoryProjects.find((p) => p.slug === slug) || null;
    }
  }

  // Creates a new project document in Firestore with memory store fallback.
  async createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const now = new Date().toISOString();

    if (!isFirebaseInitialized() || !db) {
      const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newRecord: Project = {
        id: newId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      inMemoryProjects.push(newRecord);
      return newRecord;
    }

    try {
      const docRef = db.collection('projects').doc();
      const newRecord: Project = {
        id: docRef.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      const { id, ...persistedData } = newRecord;
      await docRef.set(normalizeForFirestore(persistedData));
      inMemoryProjects.push(newRecord);
      return newRecord;
    } catch {
      const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newRecord: Project = {
        id: newId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      inMemoryProjects.push(newRecord);
      return newRecord;
    }
  }

  // Updates an existing project document in Firestore with memory store fallback.
  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const existing = await this.getProjectById(id);
    if (!existing) {
      return null;
    }

    const updated: Project = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      const index = inMemoryProjects.findIndex((p) => p.id === id);
      if (index !== -1) {
        inMemoryProjects[index] = updated;
      }
      return updated;
    }

    try {
      const docRef = db.collection('projects').doc(id);
      const { id: _, ...persistedData } = updated;
      await docRef.set(normalizeForFirestore(persistedData), { merge: true });
      const index = inMemoryProjects.findIndex((p) => p.id === id);
      if (index !== -1) {
        inMemoryProjects[index] = updated;
      }
      return updated;
    } catch {
      const index = inMemoryProjects.findIndex((p) => p.id === id);
      if (index !== -1) {
        inMemoryProjects[index] = updated;
      }
      return updated;
    }
  }

  // Deletes a project document from Firestore metadata with memory store fallback.
  async deleteProject(id: string): Promise<boolean> {
    const existing = await this.getProjectById(id);
    if (!existing) {
      return false;
    }

    if (!isFirebaseInitialized() || !db) {
      inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
      return true;
    }

    try {
      await db.collection('projects').doc(id).delete();
      inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
      return true;
    } catch {
      inMemoryProjects = inMemoryProjects.filter((p) => p.id !== id);
      return true;
    }
  }
}

export const projectRepository = new ProjectRepository();
