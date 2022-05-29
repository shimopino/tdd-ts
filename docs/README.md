# メモ

## 環境構築

## フロントエンド

`npm` のワークスペース機能を使用するため、下記のコマンドを実行する際には `-w frontend` を末尾に付与する。

```bash
# Reactを使用する
npm install --save react react-dom -w frontend
npm install --save-dev @types/react @types/react-dom -w frontend

# ビルドシステムに Vitejs を採用する
npm install --save-dev typescript -w frontend
npm install --save-dev vite @vitejs/plugin-react -w frontend

# フロントエンド側でTypeScript設定を作成する
npx -w frontend tsc --init
```

参考資料

- [Vite/React Trying Online](https://vitejs.dev/guide/#trying-vite-online)

### バックエンド

`npm` のワークスペース機能を使用するため、下記のコマンドを実行する際には `-w backend` を末尾に付与する。

```bash
npm install express

npm install --save-dev typescript @types/express @types/node

npx tsc --init

npm install --save-dev concurrently nodemon

npm install --save-dev jest @types/jest supertest @types/supertest @swc/core @swc/jest

npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

npm install --save-dev prettier eslint-config-prettier

npm install sequelize sqlite3
```

参考資料

- [How to set up TypeScript with Node.js and Express](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)
- [npm workspaces とモノレポ探検記](https://zenn.dev/suin/scraps/20896e54419069)
