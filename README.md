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

## GitHub Pages への公開

`.github/workflows/ci.yml` で CI/CD を実行する。

- CI: Pull Request と `main` ブランチへの push で、Node.js のセットアップ、依存関係のインストール、`pnpm build` を実行する。
- CD: CI 成功後、`main` ブランチへの push の場合だけ `dist` を GitHub Pages にデプロイする。

通常は `develop` で開発し、Pull Request を `main` にマージすると公開される。Pull Request の段階では公開されない。

初回のみ、次の設定を行う。

1. リポジトリの Settings > Pages > Source で **GitHub Actions** を選択する。
2. Actions が実行できるよう、Settings > Actions > General > Workflow permissions でワークフローの実行を許可する。
3. `main` への push 後、Actions の `CI/CD` ワークフローが成功することを確認する。
4. Pages の Custom domain に `goatech.jp` を設定し、HTTPS を有効にする。

カスタムドメインは `public/CNAME` で `goatech.jp` を指定している。Vite のビルド時にこのファイルが `dist/CNAME` としてコピーされ、GitHub Pages がドメイン設定を維持する。

DNS では、`goatech.jp` の apex に GitHub Pages の A レコード（`185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`）を設定する。`www` も使用する場合は、`www` から `goatech.jp` への CNAME レコードを追加する。