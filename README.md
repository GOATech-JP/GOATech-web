# GOATech Web

合同会社GOATechのコーポレートサイト兼、レンタル業務向けSaaS「Rendix」の紹介サイト。<br>
レンタル業務の課題、Rendixの機能・強み、導入フロー、料金案内、FAQ、会社概要、お問い合わせフォームを掲載。

## 技術構成

- React 19
- Vite
- TypeScript
- Tailwind CSS v4

## 開発環境の起動

```bash
pnpm install
pnpm dev --port 8443
```

ブラウザで `http://localhost:8443` を開いて確認する。

## その他のコマンド

```bash
pnpm build    # 本番ビルド
pnpm preview  # 本番ビルドのプレビュー
pnpm format   # コード整形
```

開発サーバーを停止する場合は、起動中のターミナルで `Ctrl+C` を押下。