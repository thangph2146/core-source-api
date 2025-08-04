import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<{ user: User; message: string }> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        isEmailVerified: false,
      },
    });

    // Send verification email
    await this.sendVerificationEmail(user);

    return {
      user: { ...user, password: null },
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new BadRequestException(
        'Please verify your email before logging in',
      );
    }

    // Create session token
    const token = await this.createSession(user.id);

    return {
      user: { ...user, password: null },
      token,
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const verification = await this.prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verification) {
      throw new BadRequestException('Invalid verification token');
    }

    if (verification.isUsed) {
      throw new BadRequestException('Token already used');
    }

    if (verification.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    // Update user and verification
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: verification.userId },
        data: { isEmailVerified: true },
      }),
      this.prisma.emailVerification.update({
        where: { id: verification.id },
        data: { isUsed: true },
      }),
    ]);

    return { message: 'Email verified successfully' };
  }

  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return { exists: !!user };
  }

  async logout(token: string): Promise<{ message: string }> {
    await this.prisma.authSession.deleteMany({
      where: { token },
    });

    return { message: 'Logged out successfully' };
  }

  async validateToken(token: string): Promise<User | null> {
    const session = await this.prisma.authSession.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  }

  private async createSession(userId: number): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.authSession.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return token;
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await this.prisma.emailVerification.create({
      data: {
        userId: user.id,
        email: user.email,
        token,
        expiresAt,
      },
    });

    // Skip email sending in test environment
    if (process.env.NODE_ENV === 'test') {
      console.log(`Verification token for ${user.email}: ${token}`);
      return;
    }

    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your email',
      html: `
        <h1>Welcome to Core Source API!</h1>
        <p>Please click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
  }

  // OAuth methods (placeholder for Gmail integration)
  async handleOAuthLogin(profile: {
    email: string;
    name: string;
    picture?: string;
  }): Promise<{ user: User; token: string }> {
    let user = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      // Create user from OAuth profile
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          isEmailVerified: true, // OAuth users are pre-verified
        },
      });
    }

    const token = await this.createSession(user.id);

    return {
      user: { ...user, password: null },
      token,
    };
  }
}
