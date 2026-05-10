import liff from '@line/liff';
import type { LineProfile } from './types';

let initialized = false;

export async function ensureLiffReady(): Promise<typeof liff> {
  if (initialized) return liff;

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  if (!liffId) {
    throw new Error('NEXT_PUBLIC_LIFF_ID is not configured');
  }

  await liff.init({ liffId });

  if (!liff.isLoggedIn()) {
    liff.login();
    return liff;
  }

  initialized = true;
  return liff;
}

export async function getLineProfile(): Promise<LineProfile> {
  await ensureLiffReady();
  const profile = await liff.getProfile();
  return {
    userId: profile.userId,
    displayName: profile.displayName,
    pictureUrl: profile.pictureUrl,
    statusMessage: profile.statusMessage,
  };
}

export async function isInLineClient(): Promise<boolean> {
  await ensureLiffReady();
  return liff.isInClient();
}

export async function closeLiff(): Promise<void> {
  await ensureLiffReady();
  if (liff.isInClient()) {
    liff.closeWindow();
  }
}
