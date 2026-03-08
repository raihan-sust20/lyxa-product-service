import type { Metadata } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Thin wrapper around JwtService.decode() for extracting JWT payload
 * without signature verification.
 *
 * Use this only when the token has already been verified upstream
 * (e.g. by JwtAuthGuard via auth-service). Never trust decoded data
 * from an unverified token for authorization decisions.
 */
@Injectable()
export class UserDataExtractService {
  constructor(private readonly jwtService: JwtService) {}

  extractUserData(metadata: Metadata): { userId: string; email: string } {
    const token = this.extractBearerToken(metadata);

    const payload = this.jwtService.decode(token);

    if (!payload || typeof payload !== 'object') {
      throw new Error('Failed to decode JWT payload');
    }

    const { sub: userId, email } = payload;
    return { userId, email };
  }

  private extractBearerToken(metadata: Metadata): string {
      const [values] = metadata.get('authorization');
  
      const header = values.toString();
      const authToken = header.split(' ')[1];
      return authToken;
    }
}
