import {
  users,
  clients,
  contactForms,
  messages,
  documents,
  type User,
  type UpsertUser,
  type Client,
  type InsertClient,
  type ContactForm,
  type InsertContactForm,
  type Message,
  type InsertMessage,
  type Document,
  type InsertDocument,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Client operations
  getClients(): Promise<Client[]>;
  getClientByUserId(userId: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Contact form operations
  getContactForms(): Promise<ContactForm[]>;
  createContactForm(contactForm: InsertContactForm): Promise<ContactForm>;
  updateContactFormStatus(id: number, status: string): Promise<ContactForm>;
  
  // Message operations
  getAllMessages(): Promise<Message[]>;
  getMessagesByClientId(clientId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Document operations
  getAllDocuments(): Promise<Document[]>;
  getDocumentsByClientId(clientId: number): Promise<Document[]>;
  
  // Admin stats
  getAdminStats(): Promise<{
    totalClients: number;
    activeProjects: number;
    pendingSignatures: number;
    newInquiries: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Client operations
  async getClients(): Promise<Client[]> {
    return await db.select().from(clients).orderBy(desc(clients.createdAt));
  }

  async getClientByUserId(userId: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.userId, userId));
    return client;
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(clientData).returning();
    return client;
  }

  // Contact form operations
  async getContactForms(): Promise<ContactForm[]> {
    return await db.select().from(contactForms).orderBy(desc(contactForms.createdAt));
  }

  async createContactForm(contactFormData: InsertContactForm): Promise<ContactForm> {
    const [contactForm] = await db.insert(contactForms).values(contactFormData).returning();
    return contactForm;
  }

  async updateContactFormStatus(id: number, status: string): Promise<ContactForm> {
    const [contactForm] = await db
      .update(contactForms)
      .set({ status })
      .where(eq(contactForms.id, id))
      .returning();
    return contactForm;
  }

  // Message operations
  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessagesByClientId(clientId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.clientId, clientId))
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(messageData).returning();
    return message;
  }

  // Document operations
  async getAllDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(desc(documents.createdAt));
  }

  async getDocumentsByClientId(clientId: number): Promise<Document[]> {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.clientId, clientId))
      .orderBy(desc(documents.createdAt));
  }

  // Admin stats
  async getAdminStats(): Promise<{
    totalClients: number;
    activeProjects: number;
    pendingSignatures: number;
    newInquiries: number;
  }> {
    const [clientCount] = await db.select({ count: count() }).from(clients);
    const [activeProjectCount] = await db.select({ count: count() }).from(clients).where(eq(clients.status, 'active'));
    const [pendingDocsCount] = await db.select({ count: count() }).from(documents).where(eq(documents.status, 'pending'));
    const [unreadFormsCount] = await db.select({ count: count() }).from(contactForms).where(eq(contactForms.status, 'unread'));

    return {
      totalClients: clientCount.count,
      activeProjects: activeProjectCount.count,
      pendingSignatures: pendingDocsCount.count,
      newInquiries: unreadFormsCount.count,
    };
  }
}

export const storage = new DatabaseStorage();