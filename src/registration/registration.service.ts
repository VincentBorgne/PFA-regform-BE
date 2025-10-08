 
import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../database/drizzle.module';
import * as schema from '../database/schema';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class RegistrationService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
    private emailService: EmailService,
  ) {}

  async create(createRegistrationDto: CreateRegistrationDto) {
    // Check if email already exists
    const existingRegistration = await this.db
      .select()
      .from(schema.registrations)
      .where(eq(schema.registrations.email, createRegistrationDto.email))
      .limit(1);

    if (existingRegistration.length > 0) {
      throw new ConflictException('Email already registered');
    }

    // Insert registration
    const [registration] = await this.db
      .insert(schema.registrations)
      .values({
        email: createRegistrationDto.email,
        whatsapp: createRegistrationDto.whatsapp,
        fullName: createRegistrationDto.fullName,
        displayName: createRegistrationDto.displayName,
        gender: createRegistrationDto.gender,
        birthdate: createRegistrationDto.birthdate,
        nationality: createRegistrationDto.nationality,
        tshirtSize: createRegistrationDto.tshirtSize,
        source: createRegistrationDto.source,
        partnerWhatsapp: createRegistrationDto.partnerWhatsapp,
        partnerName: createRegistrationDto.partnerName,
        playerLevel: createRegistrationDto.playerLevel,
        partnerLevel: createRegistrationDto.partnerLevel,
        tournaments: createRegistrationDto.tournaments,
        communityTournaments: createRegistrationDto.communityTournaments,
        rankings: createRegistrationDto.rankings,
        category: createRegistrationDto.category,
        playtimeConstraint: createRegistrationDto.playtimeConstraint,
        termsAccepted: createRegistrationDto.termsAccepted,
      })
      .returning();

	// Send confirmation email (non-blocking)
	this.emailService
	  .sendConfirmationEmail(registration)
	  .catch((error) => console.error('Email failed:', error));

    return {
      success: true,
      message: 'Registration successful',
      registration: {
        id: registration.id,
        email: registration.email,
        displayName: registration.displayName,
      },
    };
  }
// ADD these two methods to the bottom of your existing RegistrationService class
// (after the create method, before the closing })

async getTeamsReport() {
  // Fetch all registrations
  const registrations = await this.db
    .select()
    .from(schema.registrations)
	.where(eq(schema.registrations.termsAccepted, true))
    .orderBy(schema.registrations.createdAt);

  // Build teams by matching players
  const teams: any[] = [];
  const processedIds = new Set<number>();

  for (const player of registrations) {
    if (processedIds.has(player.id)) continue;

    let partner: typeof player | undefined = undefined;

    // Try to find partner bidirectionally
    if (player.partnerWhatsapp || player.whatsapp) {
      partner = registrations.find(
        (p) =>
          p.id !== player.id &&
          !processedIds.has(p.id) &&
          (
            // Player A listed B's WhatsApp
            (player.partnerWhatsapp && p.whatsapp === player.partnerWhatsapp) ||
            // Player B listed A's WhatsApp
            (p.partnerWhatsapp && p.partnerWhatsapp === player.whatsapp)
          )
      );
    }

    // Build team object
    const team = {
      id: `team-${player.id}`,
      category: player.category,
      player1: {
        id: player.id,
        name: player.fullName,
        displayName: player.displayName,
        country: player.nationality,
        level: player.playerLevel,
      },
      player2: partner
        ? {
            id: partner.id,
            name: partner.fullName,
            displayName: partner.displayName,
            country: partner.nationality,
            level: partner.playerLevel,
          }
        : player.partnerName
        ? {
            id: null,
            name: player.partnerName,
            displayName: player.partnerName,
            country: null,
            level: player.partnerLevel || 'TBD',
            notRegistered: true,
          }
        : {
            id: null,
            name: 'TBD',
            displayName: 'TBD',
            country: null,
            level: 'TBD',
            tbd: true,
          },
    };

    teams.push(team);
    processedIds.add(player.id);
    if (partner) {
      processedIds.add(partner.id);
    }
  }

  return { teams };
}

async getRegistrationStats() {
  const registrations = await this.db
    .select()
    .from(schema.registrations)
	.where(eq(schema.registrations.termsAccepted, true));

  // Count players by nationality
  const countryStats = registrations.reduce((acc, reg) => {
    acc[reg.nationality] = (acc[reg.nationality] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count by category
  const categoryStats = registrations.reduce((acc, reg) => {
    acc[reg.category] = (acc[reg.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalRegistrations: registrations.length,
    byCountry: countryStats,
    byCategory: categoryStats,
  };
}

}