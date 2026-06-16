/**
 * プロジェクト専用のロガー
 */

interface LogPayload {
  /** ログが発生したファイル名や関数名などの場所 */
  location: string;
  /** ログメッセージ */
  message: string;
  /** 関連するエラーオブジェクト */
  error?: unknown;
  /** 関連するID（ユーザーIDやトランザクションIDなど） */
  relatedId?: string;
}

/**
 * ログメッセージをフォーマットします。
 */
function formatLog(level: string, payload: LogPayload): string {
  const time = new Date().toISOString();
  const errorMsg = payload.error
    ? ` | Error: ${payload.error instanceof Error ? payload.error.stack : String(payload.error)}`
    : '';
  const relatedIdMsg = payload.relatedId ? ` | RelatedID: ${payload.relatedId}` : '';
  return `[${time}] [${level}] [${payload.location}] ${payload.message}${relatedIdMsg}${errorMsg}`;
}

export const logger = {
  info(payload: LogPayload): void {
    // 開発中の確認等のためコンソールへ出力（本番ロギングシステムへの送信等の代替）
    console.info(formatLog('INFO', payload));
  },

  warn(payload: LogPayload): void {
    console.warn(formatLog('WARN', payload));
  },

  error(payload: LogPayload): void {
    console.error(formatLog('ERROR', payload));
  },
};
