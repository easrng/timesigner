# timesigner
A simple timestamping server.

## Setup
1. Go to https://tweetnacl.js.org/#/sign
2. Click the <kbd>Random</kbd> button by the Secret Key input box.
3. Paste the generated Secret key in the assignment to `TIMESIGNER_SECRET_KEY` and the generated Public key in the assignment to `TIMESIGNER_PUBLIC_KEY` at the top of server.js
4. Run the server behind your reverse proxy of choice. Caddy is a good option.
5. If you want to, email me the URL to your server. I will be making a list of timesigner instances and I'd love to add yours.
