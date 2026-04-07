const webPush = require('web-push');
const fs = require('fs');
const path = require('path');

const vapidKeys = webPush.generateVAPIDKeys();

const serverEnvPath = path.join(__dirname, '.env');
const clientEnvPath = path.join(__dirname, '../client/.env');

let serverEnv = '';
if (fs.existsSync(serverEnvPath)) {
    serverEnv = fs.readFileSync(serverEnvPath, 'utf8');
}
serverEnv += `\n# Web Push VAPID Keys\nVAPID_PUBLIC_KEY=${vapidKeys.publicKey}\nVAPID_PRIVATE_KEY=${vapidKeys.privateKey}\n`;
fs.writeFileSync(serverEnvPath, serverEnv);

let clientEnv = '';
if (fs.existsSync(clientEnvPath)) {
    clientEnv = fs.readFileSync(clientEnvPath, 'utf8');
}
clientEnv += `\nVITE_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}\n`;
fs.writeFileSync(clientEnvPath, clientEnv);

console.log('Keys generated and appended!');
