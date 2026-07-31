/**
 * 現実科学ラボ／現実科学研究所 — お問い合わせフォーム受信スクリプト
 *
 * このコードは Google Apps Script（script.google.com）側に貼り付けて動かすもの。
 * リポジトリには「今どのコードが動いているか」を記録する目的で置いている。
 * ここを編集しただけでは本番には反映されない（GAS 側で更新＋再デプロイが必要）。
 *
 * 受信元（いずれも fetch で multipart/form-data を POST）:
 *   - https://reality-science.com/          研究所LP の「共同研究・パートナーシップ受付」
 *   - https://reality-science.com/contact/  CONTACT ページ
 *
 * 仕様:
 *   - _hp     ハニーポット。人間には見えない欄。埋まっていればボットとみなし、
 *             攻撃者に検知させないため「成功」を装って破棄する（メールは送らない）。
 *   - _token  サイトのフォームに埋め込んだ共有トークン。不一致なら拒否。
 *             ※ トークンはページのソースに現れるため、解析する攻撃者は突破できる。
 *               無差別ボットと、URL だけを知った第三者の直接 POST を止めるための層。
 *   - _ping   疎通確認用。メールを送らず応答だけ返す（動作確認をメールなしで行える）。
 *   - 応答は常に JSON。フロントは result === 'ok' を検証して成功表示を出す。
 *
 * デプロイ時の注意（重要）:
 *   URL を変えないこと。「デプロイ」→「デプロイを管理」→ 既存デプロイの鉛筆アイコン
 *   →「バージョン: 新バージョン」→「デプロイ」の手順で更新する。
 *   「新しいデプロイ」を作ると /exec の URL が変わり、サイト側のフォームが壊れる。
 */

var TO_ADDRESS = 'reality-science@dhw.ac.jp';
var FORM_TOKEN = 'rsi-form-2026-a7f3c91e';

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // 疎通確認（メールは送らない）
    if (p._ping) {
      return jsonOut({ result: 'ok', mode: 'ping' });
    }

    // ハニーポット：ボットと判断し、成功を装って破棄
    if (p._hp) {
      return jsonOut({ result: 'ok' });
    }

    // 共有トークン照合
    if (p._token !== FORM_TOKEN) {
      return jsonOut({ result: 'error', message: 'invalid token' });
    }

    var name    = p.name    || '（未入力）';
    var email   = p.email   || '（未入力）';
    var subject = p.subject || '（件名なし）';
    var message = p.message || '（本文なし）';
    var source  = p._source || '（不明）';

    var body =
      '現実科学ラボのフォームから問い合わせが届きました。\n\n' +
      '■送信元フォーム: ' + source + '\n' +
      '■お名前: ' + name + '\n' +
      '■メールアドレス: ' + email + '\n' +
      '■題名: ' + subject + '\n' +
      '■本文:\n' + message + '\n';

    var options = {
      to: TO_ADDRESS,
      subject: '[現実科学ラボ] お問い合わせ: ' + subject,
      body: body
    };
    // 返信先は、正しい形式のときだけ設定する（不正値で送信自体が失敗するのを防ぐ）
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      options.replyTo = email;
    }
    MailApp.sendEmail(options);

    return jsonOut({ result: 'ok' });
  } catch (err) {
    return jsonOut({ result: 'error', message: String(err) });
  }
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
