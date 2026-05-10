'use client';

import { useState } from 'react';
import { logShare } from '@/lib/gas-client';

type Props = {
  referrerId: string;
  shareUrl: string;
  tweetText: string;
  qrImageUrl: string;
};

export default function ShareButtons({ referrerId, shareUrl, tweetText, qrImageUrl }: Props) {
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleLineShare() {
    const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(
      `${tweetText}\n\n${shareUrl}`
    )}`;
    logShare(referrerId, 'line').catch(() => {});
    window.open(lineShareUrl, '_blank');
  }

  function handleTwitterShare() {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    logShare(referrerId, 'twitter').catch(() => {});
    window.open(tweetUrl, '_blank');
  }

  function handleQrToggle() {
    if (!showQr) {
      logShare(referrerId, 'qr').catch(() => {});
    }
    setShowQr(!showQr);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      logShare(referrerId, 'copy').catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 失敗時はフォールバック
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleLineShare}
        className="w-full rounded-xl bg-pink-600 py-3 px-4 text-white font-medium shadow-sm hover:bg-pink-700 active:bg-pink-800 transition-colors"
      >
        📱 LINE で友達に送る
      </button>
      <button
        type="button"
        onClick={handleTwitterShare}
        className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-gray-800 font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        🐦 X(Twitter) に投稿する
      </button>
      <button
        type="button"
        onClick={handleQrToggle}
        className="w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-gray-800 font-medium shadow-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        📷 QR コードを{showQr ? '閉じる' : '表示する'}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="w-full rounded-xl border border-dashed border-gray-300 bg-white py-3 px-4 text-gray-700 text-sm hover:bg-gray-50 transition-colors"
      >
        {copied ? '✓ リンクをコピーしました' : '🔗 リンクをコピー'}
      </button>

      {showQr && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImageUrl}
            alt="紹介リンクの QR コード"
            className="mx-auto w-full max-w-xs"
          />
          <p className="mt-3 text-xs text-gray-600">
            お友達にスキャンしてもらうと、LINE 友達追加に進みます
          </p>
        </div>
      )}
    </div>
  );
}
