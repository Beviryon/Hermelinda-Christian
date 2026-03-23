export type AccessCodeDoc = {
  code: string;
  name: string;
  isActive: boolean;
  isAdmin?: boolean;
  sessionId: string | null;
  lastLoginAt: unknown | null;
};

export type LocalSession = {
  code: string;
  name: string;
  sessionId: string;
  isAdmin: boolean;
};

export type GuestMessage = {
  id: string;
  name: string;
  message: string;
  createdAt?: Date;
};

export type PhotoItem = {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
};
