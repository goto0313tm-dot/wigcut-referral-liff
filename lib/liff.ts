import liff from '@line/liff';
import type { LineProfile } from './types';

let initialized = false;

export async function ensureLiffReady(): Promise<typeof liff> {
  if (initialized) return liff;

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  if (!liffId) {
    throw new Error('NEXT_PUBLIC_LIFF_ID is not configured');
  }

  try {
    await liff.init({ liffId });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`liff.init failed: ${message}`);
  }

  if (typeof liff.ready !== 'undefined') {
    try {
      await liff.ready;
    } catch {
      // ignore
    }
  }

  if (!liff.isLoggedIn()) {
    if (liff.isInClient()) {
      throw new Error(
        'LIFF が LINE 内ブラウザでログイン情報を取得できません。LINE アプリを最新版に更新して再度お試しください。'
      );
    }
    liff.login();
    throw new Error('Redirecting to LINE Login...');
  }

  initialized = true;
  return liff;
}

export async function getLineProfile(): Promise<LineProfile> {
  await ensureLiffReady();
  try {
    const profile = await liff.getProfile();
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
      statusMessage: profile.statusMessage,
    };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(`liff.getProfile failed: ${message}`);
  }
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
