const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "upt",
  version: "1.0.6",
  hasPermssion: 0,
  credits: "Rx Abdullah",
  usePrefix: true,
  description: "Bot status image",
  commandCategory: "system",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  try {
    // 🖼 Background image
    const bgPath = path.join(__dirname, "cache", "status_bg.png");
    const bgImage = await loadImage(bgPath);

    // 🎨 Canvas setup
    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // 🕒 Calculate uptime & ping
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const ping = Date.now() - event.timestamp;
    const owner = "sasuke";

    // ✍️ Base text style
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 6;
    ctx.textAlign = "left";

    // 🧠 Title
    ctx.font = "bold 55px Arial, sans-serif";
    ctx.fillText("⚡ BOT STATUS ⚡", 50, 100);

    // 🧱 Text positions
    const startX = 120;
    const line1Y = 200;
    const line2Y = 270;
    const line3Y = 340;

    // 🔠 Bold text
    ctx.font = "bold 40px Arial, sans-serif";

    // Draw uptime
    ctx.fillText(`UPTIME : ${hours}h ${minutes}m ${seconds}s`, startX, line1Y);

    // Draw ping
    ctx.fillText(`PING   : ${ping}ms`, startX, line2Y);

    // Draw owner
    ctx.fillText(`OWNER  : ${owner}`, startX, line3Y);

    // 🧩 Emoji icons (image-based)
    const emojiClock = await loadImage("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/23f1.png"); // ⏱
    const emojiSignal = await loadImage("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4f6.png"); // 📶
    const emojiBolt = await loadImage("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/26a1.png"); // ⚡

    ctx.drawImage(emojiClock, 50, line1Y - 45, 50, 50);
    ctx.drawImage(emojiSignal, 50, line2Y - 45, 50, 50);
    ctx.drawImage(emojiBolt, 50, line3Y - 45, 50, 50);

    // 🖼 Output image
    const outPath = path.join(__dirname, "cache", `status_${event.senderID}.png`);
    fs.writeFileSync(outPath, canvas.toBuffer("image/png"));

    // 📤 Send & cleanup
    return api.sendMessage(
      { attachment: fs.createReadStream(outPath) },
      event.threadID,
      () => fs.unlinkSync(outPath),
      event.messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Error while generating status photo!", event.threadID, event.messageID);
  }
};
