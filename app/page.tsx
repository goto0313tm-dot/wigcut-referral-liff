'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ensureLiffReady } from '@/lib/liff';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureLiffReady();
        if (cancelled) return;

        // SDK 初期化完了後、URL の ref を確認して適切なページへ遷移
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
          router.replace(`/redirect?ref=${encodeURIComponent(ref)}`);
          return;
        }

        // ref が無ければ紹介者発行画面へ
        router.replace('/referrer');
      } catch (e: unknown) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) return <ErrorMessage message={error} />;
  return <LoadingSpinner message="読み込み中…" />;
}
