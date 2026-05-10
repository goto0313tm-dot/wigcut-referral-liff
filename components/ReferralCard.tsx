import type { IssueReferrerResponse } from '@/lib/types';
import ProgressBar from './ProgressBar';
import ShareButtons from './ShareButtons';

type Props = {
  data: IssueReferrerResponse;
};

export default function ReferralCard({ data }: Props) {
  const {
    referrer_id,
    coupon_code,
    coupon_amount,
    referral_count,
    pending_count,
    display_name,
    share_url,
    tweet_text,
    qr_image_url,
    history,
  } = data;

  return (
    <div className="mx-auto max-w-md px-4 py-6 space-y-6">
      <header>
        <h1 className="text-xl font-bold text-gray-900">こんにちは、{display_name} さん 🌸</h1>
        <p className="mt-1 text-sm text-gray-600">
          友達紹介で、お得にウィッグを作りましょう
        </p>
      </header>

      {/* 残高カード */}
      <section className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-5 shadow-sm">
        <p className="text-xs text-gray-500">あなたの現在のクーポン</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {coupon_amount.toLocaleString()} 円OFF
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {referral_count} 人紹介中
          {pending_count > 0 && `(仮カウント: ${pending_count})`}
        </p>
        <p className="mt-3 text-xs text-gray-400 break-all">
          コード:{' '}
          <span className="font-mono text-gray-600">{coupon_code}</span>
        </p>
      </section>

      {/* 進捗ゲージ */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-xs text-gray-500 mb-2">進捗</p>
        <ProgressBar count={referral_count} />
      </section>

      {/* 共有ボタン */}
      <section>
        <p className="text-sm font-medium text-gray-700 mb-3">友達に紹介する</p>
        <ShareButtons
          referrerId={referrer_id}
          shareUrl={share_url}
          tweetText={tweet_text}
          qrImageUrl={qr_image_url}
        />
      </section>

      {/* 紹介履歴 */}
      {history.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-700 mb-3">紹介履歴</p>
          <ul className="space-y-2">
            {history.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.date}</span>
                <span className="text-pink-600 font-medium">
                  +{item.amount.toLocaleString()}円
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="pt-2 pb-6">
        <p className="text-xs text-gray-400 text-center">
          ※ 紹介クーポンは累積上限なし<br />
          ※ ご自身の購入でも、初回購入から使えます
        </p>
      </footer>
    </div>
  );
}
