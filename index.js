const {
    WAConnection,
    MessageType,
    Presence,
    GroupSettingChange,
    Mimetype
} = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const { help } = require('./src/help')
const { wait, simih, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const lolis = require('lolis.life')
const loli = new lolis()
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./src/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./src/simi.json'))
prefix = '#'
blocked = []

function kyun(seconds){
  function pad(s){
    return (s < 10 ? '0' : '') + s;
  }
  var hours = Math.floor(seconds / (60*60));
  var minutes = Math.floor(seconds % (60*60) / 60);
  var seconds = Math.floor(seconds % 60);

  //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
  return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

async function starts() {
	const client = new WAConnection()
	client.logger.level = 'warn'
	console.log(banner.string)
	client.on('qr', () => {
		console.log(color('[','white'), color('!','red'), color(']','white'), color('SCAN QR CODE NYA BENTOL GANS'))
	})
	client.on('credentials-updated', () => {
		fs.writeFileSync('./BarBar.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
		info('2', 'Login Info Updated')
	})
	fs.existsSync('./BarBar.json') && client.loadAuthInfo('./BarBar.json')
	client.on('connecting', () => {
		start('2', 'Connecting...')
	})
	client.on('open', () => {
		success('2', 'Connected')
	})
	await client.connect({timeoutMs: 30*1000})

	client.on('group-participants-update', async (anu) => {
		try {
			const mdata = await client.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i.ibb.co/swr7r1z/IMG-20201211-WA0508-picsay.jpg'
				}
				teks = `Selamat Datang @${num.split('@')[0]} di ${mdata.subject}`
				client.sendMessage(mdata.id, teks, MessageType.text, {contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://i.ibb.co/swr7r1z/IMG-20201211-WA0508-picsay.jpg'
				}
				teks = `Selamat Jalan @${num.split('@')[0]}`
				client.sendMessage(mdata.id, teks, MessageType.text, {contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	client.on('CB:Blocklist', json => {
		if (blocked.length > 2) return
	    for (let i of json[1].blocklist) {
	    	blocked.push(i.replace('c.us','s.whatsapp.net'))
	    }
	})

	client.on('message-new', async (mek) => {
		try {
			if (!mek.message) return
			if (mek.key && mek.key.remoteJid == 'status@broadcast') return
			if (mek.key.fromMe) return
			global.prefix
			global.blocked
			const content = JSON.stringify(mek.message)
			const from = mek.key.remoteJid
			const type = Object.keys(mek.message)[0]
			const apiKey = 'SLpvUgOcMYwIx0pFeELt'
			const vkey = 'AnjirCepuYaa'
			const pushname = client.chats.get(mek.participant) === undefined ? (client.contacts[mek.key.remoteJid].notify ? client.contacts[mek.key.remoteJid].notify : "Cuyy") : (client.contacts[mek.participant].notify ? client.contacts[mek.participant].notify : "Cuyy")
			const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
			const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
			body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
			budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
			const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
			const args = body.trim().split(/ +/).slice(1)
			const isCmd = body.startsWith(prefix)

			mess = {
				wait: '*[Processing]* Sabar cuyy ⌛',
				success: 'Berhasil ✔️',
				error: {
					stick: 'Gagal, terjadi kesalahan saat mengkonversi gambar ke sticker ❌',
					Iv: 'Link tidak valid ❌'
				},
				only: {
					group: 'Perintah ini hanya bisa di gunakan dalam grup! ❌',
					ownerG: 'Perintah ini hanya bisa di gunakan oleh owner grup! ❌',
					ownerB: 'Perintah ini hanya bisa di gunakan oleh owner bot! ❌',
					admin: 'Perintah ini hanya bisa di gunakan oleh admin grup! ❌',
					Badmin: 'Perintah ini hanya bisa di gunakan ketika bot menjadi admin! ❌'
				}
			}

			const botNumber = client.user.jid
			const ownerNumber = ["6281283883549@s.whatsapp.net"] // replace this with your number
			const isGroup = from.endsWith('@g.us')
			const sender = isGroup ? mek.participant : mek.key.remoteJid
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupId = isGroup ? groupMetadata.jid : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
			const isGroupAdmins = groupAdmins.includes(sender) || false
			const isWelkom = isGroup ? welkom.includes(from) : false
			const isNsfw = isGroup ? nsfw.includes(from) : false
			const isSimi = isGroup ? samih.includes(from) : false
			const isOwner = ownerNumber.includes(sender)
			const isUrl = (url) => {
			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
			}
			const reply = (teks) => {
				client.sendMessage(from, teks, text, {quoted:mek})
			}
			const sendMess = (hehe, teks) => {
				client.sendMessage(hehe, teks, text)
			}
			const mentions = (teks, memberr, id) => {
				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
			}

			colors = ['red','white','black','blue','yellow','green']
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
			if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
			switch(command) {
				case 'bentol':
				case 'tol':
					client.sendMessage(from, help(prefix, pushname), text)
					break
				case 'time':
					me = client.user
					uptime = process.uptime()
					tes = `*Bot sudah aktif selama*\n${kyun(uptime)}`
					client.sendMessage(from, tes, text, {quoted: mek})
					break
				case 'info':
					me = client.user
					uptime = process.uptime()
					teks = `*Nama Bot* : ${me.name}\n*Nomor Bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Total Block Contact* : ${blocked.length}\n*The bot is active on* : ${kyun(uptime)}`
					buffer = await getBuffer(me.imgUrl)
					client.sendMessage(from, buffer, image, {caption: teks, contextInfo:{mentionedJid: [me.jid]}})
					break
				case 'blocklist':
					teks = 'This is list of blocked number :\n'
					for (let block of blocked) {
						teks += `~> @${block.split('@')[0]}\n`
					}
					teks += `Total : ${blocked.length}`
					client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": blocked}})
					break
				case 'ocr':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						reply(mess.wait)
						await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
							.then(teks => {
								reply(teks.trim())
								fs.unlinkSync(media)
							})
							.catch(err => {
								reply(err.message)
								fs.unlinkSync(media)
							})
					} else {
						reply('Foto aja cuyy')
					}
					break
				case 'stiker':
				case 'sticker':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.input(media)
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								reply(mess.error.stick)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
						const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						reply(mess.wait)
						await ffmpeg(`./${media}`)
							.inputFormat(media.split('.')[1])
							.on('start', function (cmd) {
								console.log(`Started : ${cmd}`)
							})
							.on('error', function (err) {
								console.log(`Error : ${err}`)
								fs.unlinkSync(media)
								tipe = media.endsWith('.mp4') ? 'video' : 'gif'
								reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
							})
							.on('end', function () {
								console.log('Finish')
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(media)
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)
					} else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ranw = getRandom('.webp')
						ranp = getRandom('.png')
						reply(mess.wait)
						keyrmbg = 'Your-ApiKey'
						await removeBackgroundFromImageFile({path: media, apiKey: keyrmbg.result, size: 'auto', type: 'auto', ranp}).then(res => {
							fs.unlinkSync(media)
							let buffer = Buffer.from(res.base64img, 'base64')
							fs.writeFileSync(ranp, buffer, (err) => {
								if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
							})
							exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
								fs.unlinkSync(ranp)
								if (err) return reply(mess.error.stick)
								buff = fs.readFileSync(ranw)
								client.sendMessage(from, buff, sticker, {quoted: mek})
							})
						})
					/*} else if ((isMedia || isQuotedImage) && colors.includes(args[0])) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						const media = await client.downloadAndSaveMediaMessage(encmedia)
						ran = getRandom('.webp')
						await ffmpeg(`./${media}`)
							.on('start', function (cmd) {
								console.log('Started :', cmd)
							})
							.on('error', function (err) {
								fs.unlinkSync(media)
								console.log('Error :', err)
							})
							.on('end', function () {
								console.log('Finish')
								fs.unlinkSync(media)
								buff = fs.readFileSync(ran)
								client.sendMessage(from, buff, sticker, {quoted: mek})
								fs.unlinkSync(ran)
							})
							.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=${args[0]}@0.0, split [a][b]; [a] palettegen=reserve_transparent=off; [b][p] paletteuse`])
							.toFormat('webp')
							.save(ran)*/
					} else {
						reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
					}
					break
				case 'opengc':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					await client.groupSettingChange(from, GroupSettingChange.messageSend, false)
					var jids = [];
					mesaj = ``;
						mesaj += '@' + mek.participant.split('@')[0] + '\n ';
						jids.push(mek.participant.replace('c.us', 's.whatsapp.net'));
						client.sendMessage(from, `Grup telah dibuka oleh admin ${mesaj}`, text, {contextInfo: {mentionedJid: jids}, previewType: 0})
					break
				case 'closegc':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					await client.groupSettingChange(from, GroupSettingChange.messageSend, true)
					var jids = [];
					mesaj = ``;
						mesaj += '@' + mek.participant.split('@')[0] + '\n ';
						jids.push(mek.participant.replace('c.us', 's.whatsapp.net'));
						client.sendMessage(from, `Grup telah ditutup oleh admin ${mesaj}`, text, {contextInfo: {mentionedJid: jids}, previewType: 0})
					break
				case 'linkgroup':
				case 'linkgrup':
				case 'linkgc':
					if (!isGroup) return reply(mess.only.group)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					linkgc = await client.groupInviteCode (from)
					yeh = `https://chat.whatsapp.com/${linkgc}\n\n*${groupName}*`
					client.sendMessage(from, yeh, text, {quoted: mek})
					break
				case 'playmp3':
					if (!isOwner) return reply('*Premium Only.*\nChat jika ingin fitur Premium : *wa.me/6281283883549*')
					if (args.length < 1) return reply('Judul nya mana cuyy')
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(9)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					const hasil = `${anu.result[0].link}`
					const hasil1 = `> *Berhasil Ditemukan* <\n\n*Judul :* ${anu.result[0].title}\n*Durasi :* ${anu.result[0].duration}\n*Tayangan :* ${anu.result[0].views}\n\nAudio akan segera dikirim. Mohon untuk tidak SPAM cuyy`
					const play = await getBuffer(anu.result[0].thumbnails[0])
					anu1 = await fetchJson(`https://mhankbarbars.herokuapp.com/api/yta?url=${hasil}&apiKey=${apiKey}`, {method: 'get'});
					if (anu1.error) return reply(anu.error)
					play1 = await getBuffer(anu1.result)
					client.sendMessage(from, play, image, {quoted: mek, caption: `${hasil1}`})
					client.sendMessage(from, play1, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case 'playmp4':
					if (!isOwner) return reply('*Premium Only.*\nChat jika ingin fitur Premium : *wa.me/6281283883549*')
					if (args.length < 1) return reply('Judulnya mana cuyy')
					reply(mess.wait)
					anu = await fetchJson(`https://api.vhtear.com/youtube?query=${body.slice(9)}&apikey=${vkey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					const play2 = `${anu.result[0].urlyt}`
					const bntl = `*[BOT]Bentol*\n\n*Judul :* ${anu.result[0].title}\n*Channel* : ${anu.result[0].channel}\n*Tayangan :* ${anu.result[0].views}\n*Durasi :* ${anu.result[0].duration} Menit\n\n*Jangan SPAM cuyy*`
					anu1 = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${play2}`, {method: 'get'});
					if (anu1.error) return reply(anu.error)
					lotneb = await getBuffer(anu1.result)
					client.sendMessage(from, lotneb, video, {quoted: mek, caption: `${bntl}`})
					break
				case 'cat':
					teks = body.slice(5)
					q2 = Math.floor(Math.random() * 900) + 300;
                    q3 = Math.floor(Math.random() * 900) + 300;
                    reply(mess.wait)
                    neko = 'http://placekitten.com/'+q3+'/'+q2
                    kucing = await getBuffer(neko)
					client.sendMessage(from, kucing, image, {quoted: mek, caption: '>//<'})
					break
				case 'tahta':
					if (args.length < 1) return reply('Teks nya mana cuyy')
					teks = body.slice(7)
					reply(mess.wait)
					tahta = await getBuffer(`https://api.vhtear.com/hartatahta?text=${teks}&apikey=${vkey}`, {method: 'get'})
					client.sendMessage(from, tahta, image, {quoted: mek})
					break
				case 't3d':
					if (args.length < 1) return reply('Teks nya mana cuyy')
					teks = body.slice(5)
					reply(mess.wait)
					t3d = await getBuffer(`https://docs-jojo.herokuapp.com/api/text3d?text=${teks}`, {method: 'get'})
					client.sendMessage(from, t3d, image, {quoted: mek})
					break
				case 'bpink':
					if (args.length < 1) return reply('Teks nya mana cuyy')
					teks = body.slice(7)
					reply(mess.wait)
					bpink = await getBuffer(`https://api.vhtear.com/blackpinkicon?text=${teks}&apikey=${vkey}`, {method: 'get'})
					client.sendMessage(from, bpink, image, {quoted: mek})
					break
				case 'party':
					if (args.length < 1) return reply('Teks nya mana cuyy')
					teks = body.slice(7)
					reply(mess.wait)
					party = await getBuffer(`https://api.vhtear.com/partytext?text=${teks}&apikey=${vkey}`, {method: 'get'})
					client.sendMessage(from, party, image, {quoted: mek})
					break
				case 'qrcode':
					if (args.length < 1) return reply('Teks nya mana cuyy')
					teks = body.slice(8)
					reply(mess.wait)
					qrcode = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${teks}`)
					client.sendMessage(from, qrcode, image, {quoted: mek})
					break
				case 'phub':
					if (args.length < 1) return reply('Teks nya mana cuyy')
					gh = body.slice(6)
					ph1 = gh.split(" ")[0];
					ph2 = gh.split(" ")[1];
					reply(mess.wait)
					buff = await getBuffer(`https://api.vhtear.com/pornlogo?text1=${ph1}&text2=${ph2}&apikey=${vkey}`)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'glitch':
					if (args.length < 1) return reply('Teks nya mana cuyy')
					gh = body.slice(8)
					ph1 = gh.split(" ")[0];
					ph2 = gh.split(" ")[1];
					reply(mess.wait)
					buff = await getBuffer(`https://api.vhtear.com/glitchtext?text1=${ph1}&text2=${ph2}&apikey=${vkey}`)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'infoig':
					if (args.length < 1) return reply('Masukan username nya cuyy')
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/stalk?username=${body.slice(9)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					const ig = `> *Berhasil Ditemukan* <\n\n*Username* : ${anu.Username}\n*Name* : ${anu.Name}\n*Followers* : ${anu.Jumlah_Following}\n*Following* : ${anu.Jumlah_Followers}\n*Post* : ${anu.Jumlah_Post}\n*Biodata* : ${anu.Biodata}`
					igpict = await getBuffer(anu.Profile_pic)
					client.sendMessage(from, igpict, image, {quoted: mek, caption: `${ig}`})
					break
				case 'waifu':
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://st4rz.herokuapp.com/api/waifu`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					const waifu = `*Name* : ${anu.name}\n*Desc* : ${anu.desc}\n*Source* : ${anu.source}`
					wpict = await getBuffer(anu.image)
					client.sendMessage(from, wpict, image, {quoted: mek, caption: `${waifu}`})
					break
				case 'infogempa':
					teks = body.slice(11)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/infogempa?apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					const gmpa = `*Kedalaman* : ${anu.kedalaman}\n*Koordinat* : ${anu.koordinat}\n*Lokasi* : ${anu.lokasi}\n*Magnitude* : ${anu.magnitude}\n*Potensi* : ${anu.potensi}\n*Waktu* : ${anu.waktu}`
					gemp = await getBuffer(anu.map)
					client.sendMessage(from, gemp, image, {quoted: mek, caption: `${gmpa}`})
					break
				case 'waifuv2':
					teks = body.slice(9)
					reply(mess.wait)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/waifu2`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					wpict2 = await getBuffer(anu.img)
					client.sendMessage(from, wpict2, image, {quoted: mek, caption: '>//<'})
					break
				case 'hentai':
					if (!isOwner) return reply('*18+ Only*')
					teks = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/hentai`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					hntai = await getBuffer(anu.result)
					client.sendMessage(from, hntai, image, {quoted: mek, caption: '>//<'})
					break
				case 'nekonime':
					teks = body.slice(10)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/nekonime`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					nime = await getBuffer(anu.result)
					client.sendMessage(from, nime, image, {quoted: mek, caption: '>//<'})
					break
				case 'anime':
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://tobz-api.herokuapp.com/api/randomanime`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					anime = await getBuffer(anu.result)
					client.sendMessage(from, anime, image, {quoted: mek, caption: '>//<'})
					break
				case 'animewallpaper':
					teks = body.slice(15)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/random/wallpaper?apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					wall = await getBuffer(anu.result)
					client.sendMessage(from, wall, image, {quoted: mek, caption: '>//<'})
					break
				case 'trap':
					teks = body.slice(5)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/random/trap?apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					rap = await getBuffer(anu.result)
					client.sendMessage(from, rap, image, {quoted: mek, caption: '>//<'})
					break
				case 'quotes':
					teks = body.slice(8)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/randomquotes`, {method: 'get'})
					tes = `${anu.quotes}\n\n*${anu.author}*`
					client.sendMessage(from, tes, text, {quoted: mek})
					break
				case 'animequotes':
					teks = body.slice(8)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/quotesnime/random`, {method: 'get'})
					qutes = `*Anime* : ${anu.data.anime}\n*Chara* : ${anu.data.chara}\n*Quotes* : ${anu.data.quote}`
					client.sendMessage(from, qutes, text, {quoted: mek})
					break
				case 'namajepang':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(12)
					anu = await fetchJson(`https://api.terhambar.com/ninja?nama=${teks}`, {method: 'get'})
					jpn = `*${anu.result.ninja}*`
					client.sendMessage(from, jpn, text, {quoted: mek})
					break
				case 'alay':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(6)
					anu = await fetchJson(`https://api.terhambar.com/bpk?kata=${teks}`, {method: 'get'})
					lay = `*${anu.text}*`
					client.sendMessage(from, lay, text, {quoted: mek})
					break
				case 'brainly':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(9)
					reply(mess.wait)
					anu = await fetchJson(`https://api.vhtear.com/branly?query=${teks}&apikey=${vkey}`)
					titit = `${anu.result.data}`
					client.sendMessage(from, titit, text, {quoted: mek})
					break
				case 'wiki':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(6)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/wiki?q=${teks}&lang=id&apiKey=${apiKey}`, {method: 'get'})
					titi = `${anu.result} ${anu.references} ${anu.source}`
					client.sendMessage(from, titi, text, {quoted: mek})
					break
				case 'wikien':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(8)
					reply(mess.wait)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/wikien?q=${teks}`, {method: 'get'})
					uwu = `${anu.result}`
					client.sendMessage(from, uwu, text, {quoted: mek})
					break
				case 'kbbi':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(6)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/kbbi?query=${teks}&lang=id&apiKey=${apiKey}`, {method: 'get'})
					tata = `${anu.result}`
					client.sendMessage(from, tata, text, {quoted: mek})
					break
				case 'jadwaltv':
					if (args.length < 1) return reply('Channelnya mana cuyy')
					teks = body.slice(10)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/jdtv?ch=${teks}&apiKey=${apiKey}`, {method: 'get'})
					tutu = `*JADWAL TV BERDASARKAN CHANNEL*\n${anu.result}`
					client.sendMessage(from, tutu, text, {quoted: mek})
					break
				case 'jadwaltvnow':
					teks = body.slice(13)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/jadwaltvnow`, {method: 'get'})
					jdtv = `*JADWAL TV SEKARANG*\n${anu.result.jadwalTV}\n*Jam* : ${anu.result.jam}`
					client.sendMessage(from, jdtv, text, {quoted: mek})
					break
				case 'seberapagay':
					teks = body.slice(13)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howgay`, {method: 'get'})
					gay = `*Deskripsi* : ${anu.desc}\n*Persen* : ${anu.persen}%`
					client.sendMessage(from, gay, text, {quoted: mek})
					break
				case 'seberapabucin':
					teks = body.slice(15)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/howbucins`, {method: 'get'})
					bcn = `*Deskripsi* : ${anu.desc}\n*Persen* : ${anu.persen}%`
					client.sendMessage(from, bcn, text, {quoted: mek})
					break
				case 'chord':
					if (args.length < 1) return reply('Judulnya mana cuyy')
					teks = body.slice(7)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/chord?q=${teks}&apiKey=${apiKey}`, {method: 'get'})
					tete = `*Chord Lagu ${teks}*\n\n${anu.result}`
					client.sendMessage(from, tete, text, {quoted: mek})
					break
				case 'infocuaca':
					if (args.length < 1) return reply('Daerahnya mana cuyy')
					teks = body.slice(11)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/cuaca?q=${teks}&apiKey=${apiKey}`, {method: 'get'})
					toto = `*Angin* : ${anu.result.angin}\n*Cuaca* : ${anu.result.cuaca}\n*Desk* : ${anu.result.desk}\n*Kelembapan* : ${anu.result.kelembapan}\n*Suhu* : ${anu.result.suhu}\n*Tempat* : ${anu.result.tempat}\n*Udara* : ${anu.result.udara}`
					client.sendMessage(from, toto, text, {quoted: mek})
					break
				case 'lirik':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(7)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/lirik?judul=${teks}`, {method: 'get'})
					abab = `*Lirik Lagu ${teks}*\n\n${anu.result}`
					client.sendMessage(from, abab, text, {quoted: mek})
					break
				case 'artinama':
					if (args.length < 1) return reply('Namanya mana cuyy')
					teks = body.slice(10)
					anu = await fetchJson(`https://scrap.terhambar.com/nama?n=${teks}`, {method: 'get'})
					abcd = `*Arti Nama ${teks}*\n\n${anu.result.arti}`
					client.sendMessage(from, abcd, text, {quoted: mek})
					break
				case 'artimimpi':
					if (args.length < 1) return reply('Namanya mana cuyy')
					teks = body.slice(11)
					anu = await fetchJson(`https://api.vhtear.com/artimimpi?query=${teks}&apikey=${vkey}`)
					abc = `*Arti Mimpi ${teks}*\n\n${anu.result.hasil}`
					client.sendMessage(from, abc, text, {quoted: mek})
					break
				case 'ramalnohp':
					if (args.length < 1) return reply('Namanya mana cuyy')
					teks = body.slice(11)
					anu = await fetchJson(`https://api.vhtear.com/nomerhoki?no=${teks}&apikey=${vkey}`)
					hp = `${anu.result.hasil}`
					client.sendMessage(from, hp, text, {quoted: mek})
					break
				case 'indohot':
					if (!isOwner) return reply('*18+*')
					teks = body.slice(9)
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/indohot`, {method: 'get'})
					hot = `*Country* : ${anu.result.country}\n*Durasi* : ${anu.result.durasi}\n*Genre* : ${anu.result.genre}\n*Judul* : ${anu.result.judul}\n*Link* : ${anu.result.url}`
					client.sendMessage(from, hot, text, {quoted: mek})
					break
				case 's':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(3)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/samisami?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					smi = `${anu.result}`
					client.sendMessage(from, smi, text, {quoted: mek})
					break
				case 'cekjodoh':
					if (args.length < 1) return reply('Namanya mana cuyy')
					gh = body.slice(10)
					ph1 = gh.split(" ")[0];
					ph2 = gh.split(" ")[1];
					anu = await fetchJson(`https://scrap.terhambar.com/jodoh?n1=${ph1}&n2=${ph2}`, {method: 'get'})
					aa = `*Nama* : ${anu.result.nama_anda}\n*Pasangan* : ${anu.result.nama_pasangan}\n*Positif* : ${anu.result.sisi.positif}\n*Negatif* : ${anu.result.sisi.negatif}`
					client.sendMessage(from, aa, text, {quoted: mek})
					break
				case 'zodiak':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					gh = body.slice(8)
					ph1 = gh.split(" ")[0];
					ph2 = gh.split(" ")[1];
					anu = await fetchJson(`https://arugaz.herokuapp.com/api/getzodiak?nama=${ph1}&tgl-bln-thn=${ph2}`, {method: 'get'})
					bb = `*Nama* : ${anu.nama}\n*Lahir* : ${anu.lahir}\n*Usia* : ${anu.usia}\n*Ultah* : ${anu.ultah}\n*Zodiak* : ${anu.zodiak}`
					client.sendMessage(from, bb, text, {quoted: mek})
					break
				case 'jadwalshalat':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					teks = body.slice(14)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/jadwalshalat?daerah=${teks}&apiKey=${apiKey}`, {method: 'get'})
					shlt = `*Subuh* : ${anu.Subuh}\n*Dzuhur* : ${anu.Dzuhur}\n*Ashar* : ${anu.Ashar}\n*Maghrib* : ${anu.Maghrib}\n*Isya* : ${anu.Isya}\n*Imsyak* :${anu.Imsyak}\n*Dhuha* : ${anu.Dhuha}`
					client.sendMessage(from, shlt, text, {quoted: mek})
					break
				case 'gtts':
					if (args.length < 1) return client.sendMessage(from, 'Kode bahasanya mana cuyy', text, {quoted: mek})
					const gtts = require('./lib/gtts')(args[0])
					if (args.length < 2) return client.sendMessage(from, 'Textnya mana cuyy', text, {quoted: mek})
					dtt = body.slice(9)
					reply(mess.wait)
					ranm = getRandom('.mp3')
					rano = getRandom('.ogg')
					dtt.length > 600
					? reply('Textnya kebanyakan cuyy')
					: gtts.save(ranm, dtt, function() {
						exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
							fs.unlinkSync(ranm)
							buff = fs.readFileSync(rano)
							if (err) return reply('Gagal cuyy')
							client.sendMessage(from, buff, audio, {quoted: mek, ptt:true})
							fs.unlinkSync(rano)
						})
					})
					break
				case 'meme':
					meme = await kagApi.memes()
					reply(mess.wait)
					buffer = await getBuffer(`https://imgur.com/${meme.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				case 'memeindo':
					memein = await kagApi.memeindo()
					reply(mess.wait)
					buffer = await getBuffer(`https://imgur.com/${memein.hash}.jpg`)
					client.sendMessage(from, buffer, image, {quoted: mek, caption: '.......'})
					break
				case 'setprefix':
					if (args.length < 1) return
					if (!isOwner) return reply(mess.only.ownerB)
					prefix = args[0]
					reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
					break
				case 'hilih':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/hilih?teks=${body.slice(7)}`, {method: 'get'})
					reply(anu.result)
					break
				case 'ytmp3':
					if (!isOwner) return reply('*Premium Only.*\nChat jika ingin fitur Premium : *wa.me/6281283883549*')
					if (args.length < 1) return reply('Linknya mana cuyy')
					if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/yta?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = `*Title* : ${anu.title}\n*Filesize* : ${anu.filesize}`
					thumb = await getBuffer(anu.thumb)
					client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', filename: `${anu.title}.mp3`, quoted: mek})
					break
				case 'ytsearch':
					if (args.length < 1) return reply('Yang mau di cari apaan? titit?')
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/ytsearch?q=${body.slice(10)}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let i of anu.result) {
						teks += `*Title* : ${i.title}\n*Id* : ${i.id}\n*Published* : ${i.publishTime}\n*Duration* : ${i.duration}\n*Views* : ${h2k(i.views)}\n=================\n`
					}
					reply(teks.trim())
					break
				case 'viewedfilm':
					teks = teks = body.slice(12)
					anu = await fetchJson(`https://docs-jojo.herokuapp.com/api/mostviewfilm`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					teks = '=================\n'
					for (let u of anu.result) {
						teks += `*Title* : ${u.title}\n*Penonton* : ${u.penonton}\n*Rank* : ${u.rank}\n*Link* : ${u.link}\n=================\n`
					}
					reply(teks.trim())
					break
				case 'tiktok':
					if (args.length < 1) return reply('Linknya mana cuyy')
					if (!isUrl(args[0]) && !args[0].includes('tiktok.com')) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/tiktok?url=${args[0]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buffer = await getBuffer(anu.result)
					client.sendMessage(from, buffer, video, {quoted: mek})
					break
				case 'tiktokstalk':
					try {
						if (args.length < 1) return client.sendMessage(from, 'Usernamenya mana cuyy', text, {quoted: mek})
						let { user, stats } = await tiktod.getUserProfileInfo(args[0])
						reply(mess.wait)
						teks = `*ID* : ${user.id}\n*Username* : ${user.uniqueId}\n*Nickname* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
						buffer = await getBuffer(user.avatarLarger)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: teks})
					} catch (e) {
						console.log(`Error :`, color(e,'red'))
						reply('Kemungkinan username tidak valid')
					}
					break
				case 'nulis':
				case 'tulis':
					if (args.length < 1) return reply('Yang mau di tulis apaan cuyy')
					teks = body.slice(7)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/nulis?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek, caption: mess.success})
					break
				case 'url2img':
					tipelist = ['desktop','tablet','mobile']
					if (args.length < 1) return reply('Tipenya apa cuyy')
					if (!tipelist.includes(args[0])) return reply('Tipe desktop|tablet|mobile')
					if (args.length < 2) return reply('Urlnya mana cuyy')
					if (!isUrl(args[1])) return reply(mess.error.Iv)
					reply(mess.wait)
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/url2image?tipe=${args[0]}&url=${args[1]}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					buff = await getBuffer(anu.result)
					client.sendMessage(from, buff, image, {quoted: mek})
					break
				case 'tstiker':
				case 'tsticker':
					if (args.length < 1) return reply('Teksnya mana cuyy')
					ranp = getRandom('.png')
					rano = getRandom('.webp')
					teks = body.slice(9).trim()
					anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/text2image?text=${teks}&apiKey=${apiKey}`, {method: 'get'})
					if (anu.error) return reply(anu.error)
					exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
						fs.unlinkSync(ranp)
						if (err) return reply(mess.error.stick)
						buffer = fs.readFileSync(rano)
						client.sendMessage(from, buffer, sticker, {quoted: mek})
						fs.unlinkSync(rano)
					})
					break
				case 'cn':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Masukan teks nya, untuk mengganti nama grup')
					teks = body.slice(4)
					await client.groupUpdateSubject(from, teks)
					var jids = [];
					mesaj = ``;
					mesaj += '@' + mek.participant.split('@')[0] + '\n ';
					jids.push(mek.participant.replace('c.us', 's.whatsapp.net'));
					client.sendMessage(from, `Nama group telah diganti menjadi ${teks}\noleh ${mesaj}`, extendedTextMessage, {contextInfo: {mentionedJid: jids}, previewType: 0})
					break
				case 'hidetag':
					if (!isGroup) return reply('Fitur Khusus Grup')
					if (!isGroupAdmins) return reply(mess.only.admin)
					const ix = body.slice(9)
					group = await client.groupMetadata(from)
					var member = group['participants']
					var jids = [];
					member.map( async adm => {
						jids.push(adm.id.replace('c.us', 's.whatsapp.net'));
						})
						var options = {
							text: ix,
							contextInfo: {mentionedJid: jids},
							quoted: mek
							}
							await client.sendMessage(from, options, text)
					break
				case 'tagall':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `*⊱* @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					mentions(teks, members_id, true)
					break
				case 'tagall2':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `➥ @${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					reply(teks)
					break
                 case 'tagall3':
					members_id = []
					teks = (args.length > 1) ? body.slice(8).trim() : ''
					teks += '\n\n'
					for (let mem of groupMembers) {
						teks += `➥ https://wa.me/${mem.jid.split('@')[0]}\n`
						members_id.push(mem.jid)
					}
					client.sendMessage(from, teks, text, {detectLinks: false, quoted: mek})
					break
				case 'clearall':
					if (!isOwner) return reply('Kamu siapa?')
					anu = await client.chats.all()
					client.setMaxListeners(25)
					for (let _ of anu) {
						client.deleteChat(_.jid)
					}
					reply('Sukses delete all chat :)')
					break
				case 'bc':
					if (!isOwner) return reply('Kamu siapa?')
					if (args.length < 1) return reply('Teksnya mana bentol ganteng..')
					anu = await client.chats.all()
					if (isMedia && !mek.message.videoMessage || isQuotedImage) {
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						buff = await client.downloadMediaMessage(encmedia)
						for (let _ of anu) {
							client.sendMessage(_.jid, buff, image, {caption: `*[ Broadcast ]*\n\n${body.slice(4)}`})
						}
						reply('Suksess broadcast')
					} else {
						for (let _ of anu) {
							sendMess(_.jid, `*[ Broadcast ]*\n\n${body.slice(4)}`)
						}
						reply('Suksess broadcast')
					}
					break
				case 'promote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Berhasil Promote\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(from, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Berhasil Promote @${mentioned[0].split('@')[0]} Sebagai Admin Grup!`, mentioned, true)
						client.groupMakeAdmin(from, mentioned)
					}
					break
				case 'demote':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Berhasil Demote\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Berhasil Demote @${mentioned[0].split('@')[0]} Menjadi Member Grup!`, mentioned, true)
						client.groupDemoteAdmin(from, mentioned)
					}
					break
				case 'add':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (args.length < 1) return reply('Yang mau di add jin ya?')
					if (args[0].startsWith('08')) return reply('Gunakan kode negara cuyy')
					try {
						num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
						client.groupAdd(from, [num])
					} catch (e) {
						console.log('Error :', e)
						reply('Gagal menambahkan target, mungkin karena di private')
					}
					break
				case 'kick':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (!isBotGroupAdmins) return reply(mess.only.Badmin)
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
					if (mentioned.length > 1) {
						teks = 'Perintah di terima, mengeluarkan :\n'
						for (let _ of mentioned) {
							teks += `@${_.split('@')[0]}\n`
						}
						mentions(teks, mentioned, true)
						client.groupRemove(from, mentioned)
					} else {
						mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
						client.groupRemove(from, mentioned)
					}
					break
				case 'listadmins':
					if (!isGroup) return reply(mess.only.group)
					teks = `List admin of group *${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
					no = 0
					for (let admon of groupAdmins) {
						no += 1
						teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
					}
					mentions(teks, groupAdmins, true)
					break
				case 'leave':
                                        if (!isGroup) return reply(mess.only.group)
                                        if (isGroupAdmins || isOwner) {
                                            client.groupLeave(from)
                                        } else {
                                            reply(mess.only.admin)
                                        }
                                        break
				case 'toimg':
					if (!isQuotedSticker) return reply('Reply stickernya cuyy')
					reply(mess.wait)
					encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
					media = await client.downloadAndSaveMediaMessage(encmedia)
					ran = getRandom('.png')
					exec(`ffmpeg -i ${media} ${ran}`, (err) => {
						fs.unlinkSync(media)
						if (err) return reply('❌ Gagal, pada saat mengkonversi sticker ke gambar ❌')
						buffer = fs.readFileSync(ran)
						client.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
						fs.unlinkSync(ran)
					})
					break
				case 'simih':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isSimi) return reply('Mode simi sudah aktif')
						samih.push(from)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukses mengaktifkan mode simi di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						samih.splice(from, 1)
						fs.writeFileSync('./src/simi.json', JSON.stringify(samih))
						reply('Sukes menonaktifkan mode simi di group ini ✔️')
					} else {
						reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
					}
					break
				case 'welcome':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Hmmmm')
					if (Number(args[0]) === 1) {
						if (isWelkom) return reply('Udah aktif cuyy')
						welkom.push(from)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses mengaktifkan fitur welcome di group ini ✔️')
					} else if (Number(args[0]) === 0) {
						welkom.splice(from, 1)
						fs.writeFileSync('./src/welkom.json', JSON.stringify(welkom))
						reply('Sukses menonaktifkan fitur welcome di group ini ✔️')
					} else {
						reply('1 untuk mengaktifkan, 0 untuk menonaktifkan')
					}
					break
				case 'clone':
					if (!isGroup) return reply(mess.only.group)
					if (!isGroupAdmins) return reply(mess.only.admin)
					if (args.length < 1) return reply('Tag target yang ingin di clone cuyy')
					if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag cuyy')
					mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid[0]
					let { jid, id, notify } = groupMembers.find(x => x.jid === mentioned)
					try {
						pp = await client.getProfilePicture(id)
						buffer = await getBuffer(pp)
						client.updateProfilePicture(botNumber, buffer)
						mentions(`Foto profile Berhasil di perbarui menggunakan foto profile @${id.split('@')[0]}`, [jid], true)
					} catch (e) {
						reply('Gagal cuyy')
					}
					break
				case 'wait':
					if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
						reply(mess.wait)
						const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
						media = await client.downloadMediaMessage(encmedia)
						await wait(media).then(res => {
							client.sendMessage(from, res.video, video, {quoted: mek, caption: res.teks.trim()})
						}).catch(err => {
							reply(err)
						})
					} else {
						reply('Foto aja cuyy')
					}
					break
				default:
				if (body.startsWith(`${prefix}${command}`)) {
					reply(`Maaf *${pushname},* Perintah *${prefix}${command}* Tidak Ada Di Dalam *${prefix}bentol*`)
					}
					if (isGroup && isSimi && budy != undefined) {
						console.log(budy)
						muehe = await simih(budy)
						console.log(muehe)
						reply(muehe)
					} else {
						console.log(color('[ERROR]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
					}
                           }
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
}
starts()
