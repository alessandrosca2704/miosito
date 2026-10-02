// Password is read from a hidden terminal prompt, never command-line arguments.
const bcrypt = require("bcryptjs");
if (!process.stdin.isTTY) {
  console.error("Esegui questo comando in un terminale interattivo.");
  process.exit(1);
}
process.stdout.write("Nuova password (8–72 byte): ");
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
let password = "";
process.stdin.on("data", async (chunk) => {
  if (chunk === "\u0003") {
    process.stdin.setRawMode(false);
    process.stdout.write("\n");
    process.exit(1);
  }
  if (chunk.includes("\r") || chunk.includes("\n")) {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdout.write("\n");
    if (Buffer.byteLength(password) < 8 || Buffer.byteLength(password) > 72) {
      console.error("Usa una password tra 8 e 72 byte.");
      process.exit(1);
    }
    console.log(await bcrypt.hash(password, 12));
    password = "";
    process.exit(0);
  }
  if (chunk === "\u007f" || chunk === "\b") password = password.slice(0, -1);
  else password += chunk;
});
