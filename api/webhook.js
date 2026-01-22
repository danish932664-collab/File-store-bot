import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.BOT_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  const update = req.body;
  const msg = update.message;

  try {
    // /start command
    if (msg?.text === "/start") {
      await bot.sendMessage(
        msg.chat.id,
        "📂 File Store Bot (No Database)\n\n" +
        "➡️ Send me any file\n" +
        "➡️ I will give you a File Code\n" +
        "➡️ Use /get <file_code> to download later"
      );
    }

    // File receive
    if (msg?.document) {
      const fileId = msg.document.file_id;

      await bot.sendMessage(
        msg.chat.id,
        "✅ File received successfully\n\n" +
        "📌 **File Code (Save it):**\n" +
        `${fileId}\n\n` +
        "⬇️ Download anytime using:\n/get <file_code>",
        { parse_mode: "Markdown" }
      );
    }

    // /get command
    if (msg?.text?.startsWith("/get")) {
      const parts = msg.text.split(" ");
      if (parts.length < 2) {
        await bot.sendMessage(
          msg.chat.id,
          "❌ Wrong format\nUse:\n/get <file_code>"
        );
      } else {
        await bot.sendDocument(msg.chat.id, parts[1]);
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(200).json({ ok: true });
  }
}
