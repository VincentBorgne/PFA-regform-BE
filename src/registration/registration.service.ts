 
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
}