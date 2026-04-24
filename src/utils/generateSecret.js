// to create secret for access and refresh tokens
import crypto from "crypto";

console.log(crypto.randomBytes(64).toString("hex"));
