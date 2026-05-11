'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ensureLiffReady } from '@/lib/liff';

function HomeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const liffState = params.get('liff.state');
      if (liffState) {
        const decoded = decodeURIComponent(liffState);
        if (decoded.startsWith('/')) {
          router.replace(decoded);
          return;
        }
      }

      try {
        await ensureLiffReady();
      } catch (e: unknown) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">WIGCUT 紹介プログラム</h1>
        <p className="text-sm text-gray-600">
          このページは LIFF アプリです。WIGCUT 公式 LINE のリッチメニュー、または有効な紹介リンクからアクセスしてください。
        </p>
        <p className="text-xs text-gray-400">
          直接 URL でアクセスされた場合、想定通りに動作しません。
        </p>
        {error && (
          <p className="text-xs text-red-500">エラー: {error}</p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeInner />
    </Suspense>
  );
}
