import { Query } from 'firebase-admin/firestore';
import { db, isFirebaseInitialized } from '../config/firebase.config';
import { Blog, BlogStatus } from '../types/database.types';
import { normalizeForFirestore } from '../utils/firestore.utils';
import { AppError } from '../errors/app-error';

export interface BlogListResult {
  items: Blog[];
  total: number;
}

// In-memory fallback store for blog posts when Firestore is uninitialized or in test environment.
let inMemoryBlogs: Blog[] = [];

// Repository for managing Blog documents in Firestore.
export class BlogRepository {
  // Retrieves published blogs for public display.
  async listPublicBlogs(options: {
    page: number;
    limit: number;
    tag?: string;
    category?: string;
    search?: string;
  }): Promise<BlogListResult> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = inMemoryBlogs.filter((b) => b.status === 'published');
      if (options.tag) {
        filtered = filtered.filter((b) => b.tags?.includes(options.tag!));
      }
      if (options.category) {
        filtered = filtered.filter((b) => b.category?.toLowerCase() === options.category!.toLowerCase());
      }
      if (options.search) {
        const q = options.search.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
            b.content.toLowerCase().includes(q)
        );
      }
      filtered.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }

    try {
      const snapshot = await db.collection('blogs').where('status', '==', 'published').get();
      let allDocs: Blog[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Blog, 'id'>),
      }));

      if (options.tag) {
        allDocs = allDocs.filter((b) => b.tags?.includes(options.tag!));
      }
      if (options.category) {
        allDocs = allDocs.filter((b) => b.category?.toLowerCase() === options.category!.toLowerCase());
      }
      if (options.search) {
        const q = options.search.toLowerCase();
        allDocs = allDocs.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
            b.content.toLowerCase().includes(q)
        );
      }

      allDocs.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());

      const total = allDocs.length;
      const offset = (options.page - 1) * options.limit;
      const items = allDocs.slice(offset, offset + options.limit);
      return { items, total };
    } catch {
      let filtered = inMemoryBlogs.filter((b) => b.status === 'published');
      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }
  }

  // Retrieves all blogs for admin management (including drafts and archived).
  async listAdminBlogs(options: {
    page: number;
    limit: number;
    status?: BlogStatus;
    search?: string;
  }): Promise<BlogListResult> {
    if (!isFirebaseInitialized() || !db) {
      let filtered = [...inMemoryBlogs];
      if (options.status) {
        filtered = filtered.filter((b) => b.status === options.status);
      }
      if (options.search) {
        const q = options.search.toLowerCase();
        filtered = filtered.filter((b) => b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
      }
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = filtered.length;
      const offset = (options.page - 1) * options.limit;
      const items = filtered.slice(offset, offset + options.limit);
      return { items, total };
    }

    try {
      let query: Query = db.collection('blogs');
      if (options.status) {
        query = query.where('status', '==', options.status);
      }

      const snapshot = await query.get();
      let allDocs: Blog[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Blog, 'id'>),
      }));

      if (options.search) {
        const q = options.search.toLowerCase();
        allDocs = allDocs.filter((b) => b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q));
      }

      allDocs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const total = allDocs.length;
      const offset = (options.page - 1) * options.limit;
      const items = allDocs.slice(offset, offset + options.limit);
      return { items, total };
    } catch {
      return { items: [], total: 0 };
    }
  }

  // Retrieves a single blog post by ID.
  async getBlogById(id: string): Promise<Blog | null> {
    if (!isFirebaseInitialized() || !db) {
      return inMemoryBlogs.find((b) => b.id === id) || null;
    }

    try {
      const doc = await db.collection('blogs').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...(doc.data() as Omit<Blog, 'id'>) };
    } catch {
      return inMemoryBlogs.find((b) => b.id === id) || null;
    }
  }

  // Retrieves a published blog post by slug for public detail page.
  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const normalized = slug.toLowerCase().trim();
    if (!isFirebaseInitialized() || !db) {
      return inMemoryBlogs.find((b) => b.slug === normalized && b.status === 'published') || null;
    }

    try {
      const snapshot = await db.collection('blogs').where('slug', '==', normalized).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      const blog = { id: doc.id, ...(doc.data() as Omit<Blog, 'id'>) };
      return blog;
    } catch {
      return inMemoryBlogs.find((b) => b.slug === normalized && b.status === 'published') || null;
    }
  }

  // Creates a new blog post document.
  async createBlog(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> {
    const now = new Date().toISOString();
    const newBlog: Blog = {
      ...data,
      id: '',
      createdAt: now,
      updatedAt: now,
    };

    if (!isFirebaseInitialized() || !db) {
      newBlog.id = `blog-${Date.now()}`;
      inMemoryBlogs.unshift(newBlog);
      return newBlog;
    }

    try {
      const docRef = db.collection('blogs').doc();
      newBlog.id = docRef.id;
      const normalizedData = normalizeForFirestore(newBlog);
      await docRef.set(normalizedData);
      return newBlog;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create blog in database';
      throw AppError.internal(msg);
    }
  }

  // Updates an existing blog post document.
  async updateBlog(id: string, updates: Partial<Blog>): Promise<Blog> {
    const current = await this.getBlogById(id);
    if (!current) {
      throw AppError.notFound(`Blog with ID ${id} not found`);
    }

    const updatedBlog: Blog = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!isFirebaseInitialized() || !db) {
      const index = inMemoryBlogs.findIndex((b) => b.id === id);
      if (index !== -1) inMemoryBlogs[index] = updatedBlog;
      return updatedBlog;
    }

    try {
      const docRef = db.collection('blogs').doc(id);
      const normalized = normalizeForFirestore(updatedBlog);
      await docRef.set(normalized, { merge: true });
      return updatedBlog;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update blog in database';
      throw AppError.internal(msg);
    }
  }

  // Deletes a blog post document.
  async deleteBlog(id: string): Promise<boolean> {
    if (!isFirebaseInitialized() || !db) {
      const index = inMemoryBlogs.findIndex((b) => b.id === id);
      if (index !== -1) {
        inMemoryBlogs.splice(index, 1);
        return true;
      }
      return false;
    }

    try {
      const docRef = db.collection('blogs').doc(id);
      const doc = await docRef.get();
      if (!doc.exists) return false;
      await docRef.delete();
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete blog from database';
      throw AppError.internal(msg);
    }
  }
}

export const blogRepository = new BlogRepository();
