# shintakeda-website

合同会社シンタケダ 公式サイト

## 公開の仕組み

- `main` ブランチへのpush：GitHub Pages（テストプレビュー）だけが更新される。本番には反映されない
  - プレビュー：https://shin-73.github.io/shintakeda-website/
- 本番（shintakeda.jp）への反映：GitHub Actions の Deploy ワークフローを手動実行したときのみ（rsync over SSH でさくらサーバーへ同期）
  - 実行コマンド：`gh workflow run deploy.yml`
