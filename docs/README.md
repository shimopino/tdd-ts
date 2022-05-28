# メモ

## 環境構築

### バックエンド

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
