const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rx Modified",
  description: "Show bot prefix info without using any prefix",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
  usePrefix: false // ⭐⭐ Main part: no prefix needed
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  if (body.toLowerCase().trim() === "prefix") {
    const ping = Date.now() - event.timestamp;
    const day = moment.tz("Asia/Dhaka").format("dddd");

    // Get prefixes or set defaults
    const BOTPREFIX = global.config.PREFIX || "!";
    const GROUPPREFIX = global.data.threadData?.[threadID]?.prefix || BOTPREFIX;

    const BOTNAME = global.config.BOTNAME || "𝐒𝐚𝐬𝐮𝐤𝐞 𝐂𝐡𝐚𝐭 𝐁𝐨𝐭";

    const msg =
`◇───✦ 𝗣𝗥𝗘𝗙𝗜𝗫 𝗦𝗧𝗔𝗧𝗨𝗦 ✦───◇
• 𝗣𝗶𝗻𝗴: ${ping}ms
• 𝗗𝗮𝘆: ${day}
• 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${BOTNAME}
• 𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅: ${BOTPREFIX}
• 𝗚𝗿𝗼𝘂𝗽 𝗣𝗿𝗲𝗳𝗶𝘅: ${GROUPPREFIX}
◇────────────────◇`;

    const gifPath = path.join(__dirname, "noprefix", "abdullah.gif");

    return api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(gifPath)
      },
      threadID,
      messageID
    );
  }
};

module.exports.run = async () => {};
