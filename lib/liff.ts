import liff from '@line/liff';
import type { LineProfile } from './types';

// Promise-based ロックで並列 init を防ぐ
let initPromise: Promise<void> | null = null;

function createInitPromise(liffId: string): Promise<void> {
  return liff.init({ liffId }).then(() => {
    if (typeof liff.ready !== 'undefined') {
      return liff.ready;
    }
  });
}

export async function ensureLiffReady(): Promise<typeof liff> {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  if (!liffId) {
    throw new Error('NEXT_PUBLIC_LIFF_ID is not configured');
  }

  // 初回のみ Promise を生成、並列呼び出しは同じ Promise を待つ
  if (!initPromise) {
    initPromise = createInitPromise(liffId).catch((e: unknown) => {
      // init 失敗時はロックを解除して再試行可能にする
      initPromise = null;
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`liff.init failed: ${message}`);
    });
  }

  await initPromise;

  if (!liff.isLoggedIn()) {
    if (liff.isInClient()) {
      throw new Error(
        'LIFF が LINE 内ブラウザでログイン情報を取得できません。LINE アプリを最新版に更新して再度お試しください。'
      );
    }
    liff.login();
    throw new Error('Redirecting to LINE Login...');
  }

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
