export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mx-4 my-6 rounded-xl border border-red-200 bg-red-50 p-4">
      <p className="text-sm text-red-700 font-medium">エラーが発生しました</p>
      <p className="mt-2 text-xs text-red-600 break-all">{message}</p>
      <p className="mt-3 text-xs text-gray-600">
        もう一度お試しいただくか、WIGCUT 公式 LINE までお問い合わせください。
      </p>
    </div>
  );
}
