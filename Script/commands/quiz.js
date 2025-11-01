const axios = require("axios");

module.exports.config = {
  name: "quiz",
  version: "2.3.3",
  hasPermssion: 0,
  credits: "RUBISH API + Mention Update by rX",
  description: "Bangla Quiz with Coins System (Free to Play)",
  usePrefix: false,
  commandCategory: "Game",
  usages: "quiz [h]",
  cooldowns: 5,
  dependencies: { "axios": "" }
};

const timeoutDuration = 20 * 1000;

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (args[0]?.toLowerCase() === "h") {
    return api.sendMessage(
      `🧠 Quiz Guide:\n\n` +
      `➤ Command: quiz\n` +
      `➤ Correct Answer: +500 Coins\n` +
      `➤ Wrong Answer: No Coins deducted ❌\n` +
      `➤ You can play even with 0 Coins 🎉\n` +
      `➤ 20 seconds to answer\n\n` +
      `⚡ Good Luck!`, threadID, messageID
    );
  }

  try {
    const res = await axios.get(`https://rubish-apihub.onrender.com/rubish/quiz-api?category=Bangla&apikey=rubish69`);
    const data = res.data;

    if (!data.question || !data.answer) throw new Error("Invalid quiz data");

    const formatted =
`╭──✦ ${data.question}
├‣ 𝗔) ${data.A}
├‣ 𝗕) ${data.B}
├‣ 𝗖) ${data.C}
├‣ 𝗗) ${data.D}
╰──────────────────‣
Reply with your answer (A/B/C/D). ⏰ 20s`;

    return api.sendMessage(formatted, threadID, async (err, info) => {
      if (err) return console.error("Send error:", err);

      const timeout = setTimeout(async () => {
        const index = global.client.handleReply.findIndex(e => e.messageID === info.messageID);
        if (index !== -1) {
          try {
            await api.unsendMessage(info.messageID);
            api.sendMessage(`⏰ Time's up!\n✅ The correct answer was: ${data.answer}`, threadID);
          } catch (e) {
            console.error("Timeout unsend error:", e);
          }
          global.client.handleReply.splice(index, 1);
        }
      }, timeoutDuration);

      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        answer: data.answer,
        timeout
      });
    });

  } catch (err) {
    console.error("API fetch error:", err);
    return api.sendMessage("❌ Failed to load quiz data!", threadID, messageID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply, Currencies, Users }) {
  const { senderID, messageID, threadID, body } = event;
  const { increaseMoney } = Currencies;

  if (senderID !== handleReply.author) return;

  const userAnswer = body.trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(userAnswer)) {
    return api.sendMessage("⚠️ Please enter a valid option: A, B, C or D", threadID, messageID);
  }

  clearTimeout(handleReply.timeout);

  try {
    const name = await Users.getNameUser(senderID);
    const mentionObj = [{ id: senderID, tag: name }];

    if (userAnswer === handleReply.answer) {
      await api.unsendMessage(handleReply.messageID);
      await increaseMoney(senderID, 500);
      const total = (await Currencies.getData(senderID)).money;

      return api.sendMessage(
        {
          body: `✅ ${name}, Correct!\n💰 You've earned 500 Coins\n🏦 Balance: ${total} Coins`,
          mentions: mentionObj
        },
        threadID,
        messageID
      );
    } else {
      return api.sendMessage(
        {
          body: `❌ ${name}, Wrong answer!\n✅ Correct answer: ${handleReply.answer}\n⚡ No Coins deducted`,
          mentions: mentionObj
        },
        threadID,
        messageID
      );
    }
  } catch (e) {
    console.error("Handle reply error:", e);
  }

  const index = global.client.handleReply.findIndex(e => e.messageID === handleReply.messageID);
  if (index !== -1) global.client.handleReply.splice(index, 1);
};
