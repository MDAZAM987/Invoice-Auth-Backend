// custom.d.ts

import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: {
      userId(userId: any, s3Url: string): unknown;
      sub: string;
      username: string;
      refreshToken?: string;
    };
  }
}
