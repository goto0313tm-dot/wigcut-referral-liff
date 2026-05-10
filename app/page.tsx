export default function Home() {
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
      </div>
    </div>
  );
}
