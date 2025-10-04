 
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USERNAME'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

async sendConfirmationEmail(registrationData: any) {
  const mailOptions = {
    from: this.configService.get('MAIL_FROM'),
    to: registrationData.email,
    subject: 'Tournament Registration Confirmation',
    html: `
      <h2>Registration Confirmed!</h2>
      <p>Dear ${registrationData.displayName},</p>
      <p>Thank you for registering for the tournament. We have received your registration successfully.</p>
      
      <h3>Your Registration Details:</h3>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Full Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Display Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.displayName}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>WhatsApp:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.whatsapp}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Gender:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.gender}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Birthdate:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.birthdate}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nationality:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.nationality}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>T-Shirt Size:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.tshirtSize}</td>
        </tr>
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Category:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.category}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Your Level:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.playerLevel}</td>
        </tr>
        ${registrationData.partnerName ? `
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Partner Name:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.partnerName}</td>
        </tr>
        ` : ''}
        ${registrationData.partnerWhatsapp ? `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Partner WhatsApp:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.partnerWhatsapp}</td>
        </tr>
        ` : ''}
        ${registrationData.partnerLevel ? `
        <tr style="background-color: #f0f0f0;">
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Partner Level:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.partnerLevel}</td>
        </tr>
        ` : ''}
		${registrationData.tennisSquashBackground ? `
		<tr style="background-color: #f0f0f0;">
		  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Tennis/Squash Background:</strong></td>
		  <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.tennisSquashBackground}</td>
		</tr>
		` : ''}
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;"><strong>Playtime Constraint:</strong></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${registrationData.playtimeConstraint}</td>
        </tr>
      </table>
      
      <p style="margin-top: 20px;">We will contact you via WhatsApp with further details soon.</p>
      
      <br>
      <p>Best regards,</p>
      <p>Tournament Organizing Team</p>
    `,
  };

  try {
    await this.transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}
}