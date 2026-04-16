# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Firebase Security Rules (UID isolation)

This project now includes a `firestore.rules` file that isolates user data by `userId`.

Key behavior:

- `create`: only if `request.resource.data.userId == request.auth.uid`
- `read/update/delete`: only if `resource.data.userId == request.auth.uid`

Schema validation (required fields):

- `plantas`: `userId`
- `fotos`: `userId`, `planta_id`, `url`
- `mensagens`: `userId`, `planta_id`, `mensagem`, `lida`
- `arquivo_morto`: `userId`, `planta_id_original`

Files:
d
- `firestore.rules`
- `firebase.json`

To publish rules:

1. Install Firebase CLI (if needed): `npm i -g firebase-tools`
2. Login: `firebase login`
3. Select your project: `firebase use --add`
4. Deploy rules: `firebase deploy --only firestore:rules`
