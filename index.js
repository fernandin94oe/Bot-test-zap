
const { 
default: makeWASocket, downloadContentFromMessage,  emitGroupParticipantsUpdate,  emitGroupUpdate,  makeInMemoryStore,  prepareWAMessageMedia, MediaType,  WAMessageStatus, AuthenticationState, GroupMetadata, initInMemoryKeyStore, MiscMessageGenerationOptions,  useMultiFileAuthState, BufferJSON,  WAMessageProto,  MessageOptions, PHONENUMBER_MCC,	 WAFlag,  WANode,	 WAMetric,	 ChatModification,  MessageTypeProto,  WALocationMessage, ReconnectMode,  WAContextInfo,  proto,	 WAGroupMetadata,  ProxyAgent,	 waChatKey,  MimetypeMap,  MediaPathMap,  WAContactMessage,  WAContactsArrayMessage,  WAGroupInviteMessage,  WATextMessage,  WAMessageContent,  WAMessage,  BaileysError,  WA_MESSAGE_STATUS_TYPE,  MediaConnInfo,   generateWAMessageContent, URL_REGEX,  Contact, WAUrlInfo,  WA_DEFAULT_EPHEMERAL,  WAMediaUpload,  mentionedJid,  processTime,	 Browser, makeCacheableSignalKeyStore ,  MessageType,  Presence,  WA_MESSAGE_STUB_TYPES,  Mimetype,  relayWAMessage,	 Browsers,  GroupSettingChange,  delay,  DisconnectReason,  WASocket,  getStream,  WAProto,  isBaileys,  AnyMessageContent,  generateWAMessageFromContent, fetchLatestBaileysVersion,  processMessage,  processingMutex
} = require('@whiskeysockets/baileys');
let pino = require('pino')
const fs = require('fs')
const axios = require('axios');
const Pino = require('pino')

const PhoneNumber = require('awesome-phonenumber')
let phoneNumber = "557792142954"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const readline = require("readline")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const NodeCache = require("node-cache")




       
async function ligarbot() {
const store = makeInMemoryStore({ logger: pino().child({ level: 'debug', stream: 'store' }) })

const { state, saveCreds } = await useMultiFileAuthState('./sessao')
const { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetryCounterCache = new NodeCache() // para mensagem de nova tentativa, "mensagem de espera"
const client = makeWASocket({
logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // aparecendo QR no log do terminal
      mobile: useMobile, // API móvel (propensa a banimentos)
      browser: ['Chrome (Linux)', '', ''], // para essas questões https://github.com/WhiskeySockets/Baileys/issues/328
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      browser: ['Chrome (Linux)', '', ''], // para essas questões https://github.com/WhiskeySockets/Baileys/issues/328
      markOnlineOnConnect: true, // definir false para off-line
      generateHighQualityLinkPreview: true, // criar link de visualização alto
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolver mensagens em espera
      defaultQueryTimeoutMs: undefined, // para essas questões https://github.com/WhiskeySockets/Baileys/issues/276
   })
   
   store.bind(client.ev)

    // login usar cÃ³digo de pareamento
   // CÃ³digo fonte https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L61
   if (pairingCode && !client.authState.creds.registered) {
      if (useMobile) throw new Error('NÃ£o Ã© possÃ­vel usar o cÃ³digo de pareamento com a API mÃ³vel')

      let phoneNumber
      if (!!phoneNumber) {
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log("Comece com o cÃ³digo do paÃ­s do seu nÃºmero do WhatsApp, exemplo : +557792142954")
            process.exit(0)
         }
      } else {
         phoneNumber = await question(`Digite seu nÃºmero do WhatsApp \nPor exemplo: +557792142954: `)
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         // Pergunte novamente ao digitar o nÃºmero errado
         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log("Comece com o cÃ³digo do paÃ­s do seu nÃºmero do WhatsApp, exemplo : +557792142954")

            phoneNumber = await question(`Digite seu nÃºmero do WhatsApp \nPor exemplo: +557792142954 : `)
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            rl.close()
         }
      }

      setTimeout(async () => {
         let code = await client.requestPairingCode(phoneNumber)
         code = code?.match(/.{1,4}/g)?.join("-") || code
         console.log((`Seu cÃ³digo de emparelhamento : `),(code))
      }, 3000)
   }
astaroth = client
client.ev.on('chats.set', () => {
console.log('setando conversas...')
})

client.ev.on('contacts.set', () => {
console.log('setando contatos...')
})

client.ev.on('creds.update', saveCreds)

client.ev.on('messages.upsert', async ({ messages }) => {
try {
const info = messages[0]
if (!info.message) return 

const key = {
    remoteJid: info.key.remoteJid,
    id: info.key.id, 
    participant: info.key.participant 
}
await client.readMessages([key])
if (info.key && info.key.remoteJid == 'status@broadcast') return
const altpdf = Object.keys(info.message)
const type = altpdf[0] == 'senderKeyDistributionMessage' ? altpdf[1] == 'messageContextInfo' ? altpdf[2] : altpdf[1] : altpdf[0]

const from = info.key.remoteJid

var body = (type === 'conversation') ?
info.message.conversation : (type == 'imageMessage') ?
info.message.imageMessage.caption : (type == 'videoMessage') ?
info.message.videoMessage.caption : (type == 'extendedTextMessage') ?
info.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ?
info.message.buttonsResponseMessage.selectedButtonId : (info.message.listResponseMessage && info.message.listResponseMessage.singleSelectReply.selectedRowId.startsWith(prefix) && info.message.listResponseMessage.singleSelectReply.selectedRowId) ? info.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ?
info.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (info.message.buttonsResponseMessage?.selectedButtonId || info.message.listResponseMessage?.singleSelectReply.selectedRowId || info.text) : ''

prefix = '!'
prefixo = prefix
const isCmd = body.startsWith(prefix)
const comando = isCmd ? body.slice(1).trim().split(/ +/).shift().toLocaleLowerCase() : null

var texto_exato = (type === 'conversation') ? info.message.conversation : (type === 'extendedTextMessage') ? info.message.extendedTextMessage.text : ''

async function escrever (texto) {
await client.sendPresenceUpdate('composing', from) 
await esperar(1000)   
client.sendMessage(from, { text: texto }, {quoted: info})
}

const enviar = (texto) => {
client.sendMessage(from, { text: texto }, {quoted: info})
}

const esperar = async (tempo) => {
    return new Promise(funcao => setTimeout(funcao, tempo));
}

switch(comando) {


case 'oi':
enviar('oi tudo bem?')
break;


        case 'bebado':
          const usuario = body.split(' ')[1];
          const percentual = Math.floor(Math.random() * 100) + 1;
          enviar(`${usuario} esta ${percentual}% bebado`);
          break;

        case 'gay':
          const usuario1 = body.split(' ')[1];
          const percentual1 = Math.floor(Math.random() * 100) + 1;
          enviar(`${usuario1} é ${percentual1}% gay`);
          break;

        case 'hetero':
          const usuario2 = body.split(' ')[1];
          const percentual2 = Math.floor(Math.random() * 100) + 1;
          enviar(`${usuario2} é ${percentual2}% hetero`);
          break;

          case 'feio':
          const usuario3 = body.split(' ')[1];
          const percentual3 = Math.floor(Math.random() * 100) + 1;
          enviar(`${usuario3} é ${percentual3}% Feio`);
          break;

          case 'corno':
          const usuario4 = body.split(' ')[1];
          const percentual4 = Math.floor(Math.random() * 100) + 1;
          enviar(`${usuario4} é ${percentual4}% Corno`);
          break;

          case 'vesgo':
          const usuario5 = body.split(' ')[1];
          const percentual5 = Math.floor(Math.random() * 100) + 1;
          enviar(`${usuario5} é ${percentual5}% Vesgo`);
          break;

          case 'gostoso':
          const usuario6 = body.split(' ')[1];
          const percentual6 = Math.floor(Math.random() * 100) + 1;
          enviar(`${usuario6} é ${percentual6}% gostoso`);
          break;

          case 'gostosa':
          const usuario7 = body.split(' ')[1];
          const percentual7 = Math.floor(Math.random() * 100) + 1;
          enviar(`${usuario7} é ${percentual7}% gostosa`);
          break;

case 'menu':
  client.sendMessage(
    from,
    {
      image: fs.readFileSync('./dados/fotos/foto2.jpg'),
      caption: `


╭━━━━━◉                  ◉━━━━━╮ 

  ╔┉｡˚┉═══『❄️』═══┉｡˚┉╗    
                  LAURA BOT
  ╚┉｡˚┉═══『❄️』═══┉｡˚┉╝   
   
╰━━━◉  *by Geovana*   ◉━━━╯

｡˚ [ *I N F O  U S U Á R I O* ] ｡˚
╭•✨╼━━≺✨≻━━━╾✨•╮   
┃｡˚❄️￫ *Nick:* 
┃｡˚❄️￫ *Número:* 
┃｡˚❄️￫ *Adm:* 
╰╼━═━━≺✨≻━━═━╾╯

｡˚ [ * I N F O  C R I A D O R A* ] ｡˚
╭•✨╼━━≺✨≻━━━╾✨•╮
┃｡˚❄️￫ *Criador:* *GEOVANA*
┃｡˚❄️￫ *Número:* *558788364177*
╰╼━═━━≺✨≻━━═━╾╯
｡˚ [  *M E N U S* ] ｡˚
╭•✨╼━━≺✨≻━━━╾✨•╮
┃➥⟬❄️️⟭ !musica
┃➥⟬❄️⟭ !menu
┃➥⟬❄️⟭ !brincadeiras
┃➥⟬❄️⟭ !adm
┃➥⟬❄️⟭ !menudono
┃➥⟬❄️⟭ !menucompleto
╰╼━═━≺𝑏𝑦 Laura bot ≻━═━╾╯
      `,
    });
  break;

case 'brincadeiras':
  client.sendMessage(
    from,
    {
      image: fs.readFileSync('./dados/fotos/foto2.jpg'),
      caption: `
╭━━━━━◉         
┆    ╔┉✼┉═༺◈✼❄️️✼◈༻═┉✼┉╗    
┆    ║       *❄️️𝑩𝑹𝑰𝑵𝑪𝑨𝑫𝑬𝑰𝑹𝑨𝑺❄️️*   
┆    ╚┉✼┉═༺◈✼❄️️✼◈༻═┉✼┉╝    
╰━━━━━◉     
‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎‏‎
▢ ⌁ᴍᴇɴᴜ ᴅᴇ ʙʀɪɴᴄᴀᴅᴇɪʀᴀs,ʙʀɪǫᴜᴇ ᴄᴏᴍ sᴇᴜs ᴀᴍɪɢᴏs⌁ ▢ 
╭═══════◉
┆    ╔┉✼┉═༺◈✼❄️️✼◈༻═┉✼┉╗
┆    ║
┆    ║✼❄️️ !Gay (marca (@))
┆    ║✼❄️️ !hetero (marca (@))
┆    ║✼❄️️ !Feio (marca (@))
┆    ║✼❄️️ !Corno (marca (@))
┆    ║✼❄️️ !Vesgo (marca (@))
┆    ║✼❄️️ !Bebado (marca (@))
┆    ║✼❄️️ !Gostoso (marca (@))
┆    ║✼❄️️ !Gostosa (marca (@))
┆    ║✼❄️️ !Beijo (marca (@))
┆    ║✼❄️️ !abraco (marca (@))
┆    ║✼❄️️ !Matar (marca (@))
┆    ║✼❄️️ !Tapa (marca (@))
┆    ║✼❄️️ !Chute (marca (@))
┆    ║✼❄️️ !Dogolpe (marca (@))
┆    ║✼❄️️ !Nazista (marca (@))
┆    ║✼❄️️ !Chance (fale algo) 
┆    ║✼❄️️ !bmc
┆    ║✼❄️️ !ceu
┆    ║✼❄️️ !inferno
┆    ║✼❄️️ !webcorno  (@)
┆    ║✼❄️️ !vdd_desafio
┆    ║✼❄️️ !Casal   
┆    ║✼❄️️ !golpista
┆    ║✼❄️️ !shipo @1 @2
┆    ║✼❄️️ !kiss @1 @2
┆    ║✼❄️️ !Rankpau
┆    ║✼❄️️ !gadometro
┆    ║✼❄️️ !Rankgay    
┆    ║✼❄️️ !Rankgolpe
┆    ║✼❄️️ !Rankgado
┆    ║✼❄️️ !Rankcorno  
┆    ║✼❄️️ !Rankgostoso
┆    ║✼❄️️ !Rankgostosa
┆    ║✼❄️️ !Ranknazista
┆    ║✼❄️️ !Rankotakus
┆    ║✼❄️️ !Rankpau
┆    ║
┆    ╚┉✼┉═༺◈✼❄️️✼◈༻═┉✼┉╝
╰═══════◉
    
╭━━━━━◉         
┆    ╔┉✼┉═༺◈✼❄️️✼◈༻═┉✼┉╗    
┆    ║  *❄️️𝐆𝐀𝐌𝐄𝐒❄️️*
┆    ╚┉✼┉═༺◈✼❄️️✼◈༻═┉✼┉╝    
╰━━━━━◉     
╭═══════◉
┆    ╔┉✼┉═༺◈✼❄️️✼◈༻═┉✼┉╗
┆    ║
┆    ║✼❄️️ !roleta
┆    ║✼❄️️ !eujaeununca
┆    ║✼❄️ !akinator
┆    ║✼❄️️ !forca
┆    ║✼❄️️ !jogodavelha
┆    ║✼❄️ !Ttt 
┆    ║✼❄️️ !ppt
┆    ║✼❄️️ !ppt2
┆    ║✼❄️ !Quizanimais 
┆    ║✼❄️ !Anagrama 
┆    ║✼❄️️ !rankanagrama 
┆    ║✼❄️️ !tinder
┆    ║✼❄️️ !sairtinder
┆    ╚┉✼┉═༺◈✼❄️️✼◈༻═┉✼┉╝    
╰━━━━━◉     
      `,
    });
  break;


}


} catch (erro) {
console.log(erro)
}})

client.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update
if(lastDisconnect === undefined) {

}

if(connection === 'close') {
var shouldReconnect = (lastDisconnect.error.Boom)?.output?.statusCode !== DisconnectReason.loggedOut  
ligarbot()
}
if(update.isNewLogin) {
console.log(`conectado com sucesso`)
}})}
ligarbot()

fs.watchFile('./index.js', (curr, prev) => {
if (curr.mtime.getTime() !== prev.mtime.getTime()) {
console.log('A index foi editada, irei reiniciar...');
process.exit()
}
})

