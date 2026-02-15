# chat-room

This is a simple chat application using websocket. Build using Vue JS 3

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## How to use choose a chat room
1. First of all you need to select an account from the popup list. You will act as the selected account in th chat room.
2. To start a chat, click on the contact you want to chat with. Then you can start chatting. **Please take a note, if your opponent is not online or is not in the chat room with you, your message will not be seen by your opponent, but you can see your message. (Need to implement database for this i think.)**
3. Open other browser window and select another account to chat with the first account. If both accounts are online or in the same chat room, you can see each other's message.
4. **This application is already deployed on AWS. You can access it via [this chat room link](http://13.239.111.238).**

## Answer of Basic Question
1. Imagine you're building a website that allows users to submit photos. One of the requirements is that each photo must be reviewed by a moderator before it can be published. How would you design the logic for this process? What technologies would you use? Do you have any data structure in mind to support this based on your technology of choice to handle those data?
    - I would design the login like this:
        - when user submit photo, the photo will be stored in a temporary storage (like s3) and the photo information will be stored in database with status "pending"
        - then moderator can access the pending photo list, and can approve or reject the photo. Then if the photo is approved, backend will change the status to "approved" and move the photo to the public storage, if the photo is rejected, backend will change the status to "rejected" and delete the photo from temporary storage
    - For this process, i would use AWS S3 for storage

## Answer of Javascript / Typescript code
Please open this [File on Github](https://github.com/Ilhammeru/chat-room-be/blob/main/src/utils/helpers.ts) for the code answer

## Answer of the Vue JS question
1. Explain Vue.js reactivity and common issues when tracking changes
   - Vue.js reactivity is a system or flow that allows application track all changes to data and automatically update the DOM or component when the data changes.
   Common issues is:
        - When using array, several methods like `push`, `pop`, and else are reactive, but directly setting an index (e.g., `array[0] = newValue`) will not trigger reactivity, this happen in this project as well

2. Describe data flow between components:
    - Common data flow in vue js is parent-child data flow, which means parent component pass data to child via props, and child can emit event to parent to trigger some action (action is on parent)

3. List the most common cause of memory leaks in Vue.js apps and how they can be solved
    - Common cause of memory leaks is if we set a lot of listener, but we forget to destroy it when user leave the page or where unmount the component. To resolve this usually we can use `onUnmounted` lifecycle and run necessary action there

4. What have you used for state management
    - Since Vue js 3 im using Pinia, before that on Vue js 2 i used Vuex.

5. What’s the difference between pre-rendering and server side rendering?
    - Server side rendering is system will render HTML page on the server and send whole html to client, while pre-rendering is system will render necessary HTML then client will render the rest of the page while build time. 
    To check it you can click view source code in the browser, you will see the whole html if it is server side rendering.

## Answer of website security question
1. What is security best practices
    - Using HTTPS encryption data for transmission. Like encrypting data when sending data to server, and encrypting data when storing data in database
    - Implementing proper authentication and authorization mechanisms to ensure that only authorized users can access certain resources

## Answer of Performance best practice
1. What is performance best practices
    - Optimize images and other media assets to reduce load times. We can use webp for smaller image.
    - Using lazy load for large component or image like if we have a lot of product list like e-commerce website.
    - Using cdn for image and other static asset
    - Implement caching strategies to reduce server load
    - Minify and bundle JavaScript and CSS files to reduce the number of requests and the size of assets

## Tools
Rate of tools i used
1. Git - 5/5, i use git everyday for version control
2. Redis - 4/5, commonly i use redis for caching in backend
3. Vscode - 5/5, i use vscode for development
4. Linux - 4/5, i use linux as my daily driver. My personal laptop is using linux
5. AWS
    - EC2 - 3/5, i use it but rarely, Im usually use other VPS server outside AWS
    - Lambda - 1/5, i have never used it before, but i have some knowledge about it
    - RDS - 0/5, i have never used it before
    - Cloudwatch - 0/5, i have never used it before
    - S3 - 2/5, i have used it for storing static asset before
6. Unit testing - 3/5, i use it for testing my code, but i still need to improve my skill in writing unit test
7. Kanban boards - 5/5, i use it for project management and task tracking. Also in my current experience i build a kanban board for client

# Answer for SQL
Please check this [MD file](https://github.com/Ilhammeru/chat-room-fe/blob/main/answer.md) for that answer 

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
