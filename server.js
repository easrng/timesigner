/* global BigInt64Array BigInt */
const express = require("express");
const nacl = require("tweetnacl");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.raw({ type: () => true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/", (request, response) => {
  response.header("Content-Type", "text/plain");
  response.send(`Time Signer
-----------

A simple timestamping service.
This instance's public key is ${process.env.TIMESIGNER_PUBLIC_KEY}

Usage:

  POST / 
  Timestamp a value
  The request body MUST be 64 bytes. This SHOULD be a SHA-512 hash.
  The response will be nacl_sign(request_body + timestamp), where timestamp is a little-endian uint64 containing the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
  
  GET /key
  Get this instance's public key
  The response will be a 32 byte nacl public key.`);
});
app.get("/key", (request, response) =>
  response.send(Buffer.from(process.env.TIMESIGNER_PUBLIC_KEY, "base64"))
);
app.post("/", (request, response) => {
  console.log(request.body);
  if (request.body.byteLength != 64)
    response
      .status(422)
      .header("Content-Type", "text/plain")
      .send("You MUST send 64 bytes. No more, no less.");
  let ts = new Uint8Array(8);
  let now = BigInt(Date.now());
  for (let i = 0n; i < 8n; i++)
    ts[i] = Number((now & (0xffn << (i * 8n))) >> (i * 8n));
  response.send(
    Buffer.from(
      nacl.sign(
        Buffer.concat([request.body, ts]),
        Buffer.from(process.env.TIMESIGNER_SECRET_KEY, "base64")
      )
    )
  );
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
