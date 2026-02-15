# chat-room

This template should help get you started developing with Vue 3 in Vite.

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## How to use choose a chat room
1. First of all you need to select an account from the popup list. You will act as the selected account in th chat room.
2. To start a chat, click on the contact you want to chat with. Then you can start chatting. **Please take a note, if your opponent is not online or is not in the chat room with you, your message will not be seen by your opponent, but you can see your message. (Need to implement database for this i think.)**
3. Open other browser window and select another account to chat with the first account. If both accounts are online or in the same chat room, you can see each other's message.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
