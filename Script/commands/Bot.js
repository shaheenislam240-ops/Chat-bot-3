const axios = require("axios");
const fs = global.nodemodule["fs-extra"];

const apiJsonURL = "https://raw.githubusercontent.com/rummmmna21/rx-api/main/baseApiUrl.json";

module.exports.config = {
  name: "obot",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "𝐫𝐗",
  description: "Maria Baby-style reply system with typing effect",
  commandCategory: "noprefix",
  usages: "bot / @Sııƞƞeɽ 倫ッ",
  cooldowns: 3
};
async function getRxAPI() {
  try {
    const res = await axios.get(apiJsonURL);
    if (res.data && res.data.rx) return res.data.rx;
    throw new Error("rx key not found in JSON");
  } catch (err) {
    console.error("Failed to fetch rx API:", err.message);
    return null;
  }
}

const marker = "\u200B";
function withMarker(text) {
  return text + marker;
}

function decodeTyping(str) {
  return Buffer.from(str, "base64").toString("utf8");
}

const typingSystem = decodeTyping(`
YXdhaXQgYXBpLnNlbmRUeXBpbmdJbmRpY2F0b3JWMi(h0cnVlLCB0aHJlYWRJRCk7DQogICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHI
sIDUwMDApKTsNCiAgICBhd2FpdCBhcGkuc2VuZFR5cGluZ0luZGljYXRvclYyKGZhbHNlLCB0aHJlYWRJRCk7
`).replace(/\n/g, "");


module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, messageID, body, senderID, messageReply, mentions } = event;
  if (!body) return;

  const name = await Users.getNameUser(senderID);

  const TARGET_ID = "61560916929379";

  if (
    body.trim().toLowerCase() === "bot" ||
    (mentions && Object.keys(mentions).includes(TARGET_ID))
  ) {
    const replies = [
      "বেশি Bot Bot করলে leave নিবো কিন্তু😒",
      "🥛-🍍👈 -লে খাহ্..!😒",
      "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নাই🥺",
      "আমি আবাল দের সাথে কথা বলি না😒",
      "এতো ডেকো না, প্রেমে পরে যাবো 🙈",
      "বার বার ডাকলে মাথা গরম হয়ে যায়😑",
      "𝐓𝐨𝐫 𝐧𝐚𝐧𝐢𝐫 𝐮𝐢𝐝 𝐝𝐞 𝐝𝐞𝐤𝐡𝐚𝐢 𝐝𝐢 𝐚𝐦𝐢 𝐛𝐨𝐭 𝐧𝐚𝐤𝐢 𝐩𝐫𝐨? 🦆",
      "এতো ডাকছিস কেন? গালি শুনবি নাকি? 🤬"
    ];
    const randReply = replies[Math.floor(Math.random() * replies.length)];

    const message =
`╭──────•◈•──────╮
   Hᴇʏ Xᴀɴ I’ᴍ 𝐒𝐚𝐬𝐮𝐤𝐞 𝐁𝐨𝐭✨   

 ❄ Dᴇᴀʀ, ${name}
 💌 ${randReply}

╰──────•◈•──────╯`;

    try {
      eval(typingSystem); // 🔒 hidden typing logic
    } catch (err) {
      console.log("⚠️ Typing indicator not supported:", err.message);
    }

    return api.sendMessage(withMarker(message), threadID, messageID);
  }

  if (
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    messageReply.body?.includes(marker)
  ) {
    const replyText = body.trim();
    if (!replyText) return;

    const rxAPI = await getRxAPI();
    if (!rxAPI) return api.sendMessage("❌ Failed to load RX API.", threadID, messageID);

    try {
      eval(
        decodeTyping(`
YXdhaXQgYXBpLnNlbmRUeXBpbmdJbmRpY2F0b3JWMi(h0cnVlLCB0aHJlYWRJRCk7DQogICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHI
sIDIwMDApKTsNCiAgICBhd2FpdCBhcGkuc2VuZFR5cGluZ0luZGljYXRvclYyKGZhbHNlLCB0aHJlYWRJRCk7
`).replace(/\n/g, "")
      );
    } catch (err) {
      console.log("⚠️ Typing indicator not supported:", err.message);
    }

    try {
      const res = await axios.get(
        `${rxAPI}/simsimi?text=${encodeURIComponent(replyText)}&senderName=${encodeURIComponent(name)}`
      );
      const responses = Array.isArray(res.data.response) ? res.data.response : [res.data.response];

      for (const reply of responses) {
        await new Promise(resolve => {
          api.sendMessage(withMarker(reply), threadID, () => resolve(), messageID);
        });
      }
    } catch (err) {
      console.error(err);
      return api.sendMessage(`| Error in RX API: ${err.message}`, threadID, messageID);
    }
  }
};

module.exports.run = function() {};
