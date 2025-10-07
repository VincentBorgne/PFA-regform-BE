import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('api/registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRegistrationDto: CreateRegistrationDto) {
    return this.registrationService.create(createRegistrationDto);
  }

  @Get('teams')
  @HttpCode(HttpStatus.OK)
  async getTeams() {
    return this.registrationService.getTeamsReport();
  }

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  async getStats() {
    return this.registrationService.getRegistrationStats();
  }
}