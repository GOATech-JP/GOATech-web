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

## Vercel への公開

`goatech.jp` は Vercel で公開する。Vercel プロジェクトの設定は次のとおり。

- Framework Preset: **Vite**
- Root Directory: リポジトリのルート
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output Directory: `dist`
- Production Branch: `main`

通常は `develop` で開発し、Pull Request を `main` にマージすると本番公開される。Vercel の Domains に `goatech.jp` を追加し、表示されるDNSレコードをドメイン側に設定する。

画像・音源は `src/imports` からViteでバンドルする。サイト表示に使う画像・音源はGit LFS対象外としているため、`git add` と `git push` 後にVercelが実ファイルを取得できる。