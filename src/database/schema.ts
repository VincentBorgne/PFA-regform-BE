 
import { pgTable, serial, varchar, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  
  // Personal Information
  email: varchar('email', { length: 255 }).notNull().unique(),
  whatsapp: varchar('whatsapp', { length: 50 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  gender: varchar('gender', { length: 20 }).notNull(),
  birthdate: varchar('birthdate', { length: 10 }).notNull(),
  nationality: varchar('nationality', { length: 2 }).notNull(),
  tshirtSize: varchar('tshirt_size', { length: 10 }).notNull(),
  
  // Tournament Details
  source: varchar('source', { length: 100 }).notNull(),
  partnerWhatsapp: varchar('partner_whatsapp', { length: 50 }),
  partnerName: varchar('partner_name', { length: 255 }),
  playerLevel: varchar('player_level', { length: 50 }).notNull(),
  partnerLevel: varchar('partner_level', { length: 50 }),
  tennisSquashBackground: text('tennis_squash_background'),  // ADD THIS LINE
  
  // Tournament Experience (stored as JSON)
  tournaments: jsonb('tournaments'),
  communityTournaments: jsonb('community_tournaments'),
  rankings: jsonb('rankings'),
  
  // Registration Specifics
  category: varchar('category', { length: 20 }).notNull(),
  playtimeConstraint: varchar('playtime_constraint', { length: 50 }).notNull(),
  termsAccepted: boolean('terms_accepted').notNull().default(false),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;