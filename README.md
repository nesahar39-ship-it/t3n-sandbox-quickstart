# T3N Sandbox QA Evidence Agent

A small, maintainable prototype that connects to the T3N testnet and creates a structured QA-evidence record only after a T3N DID is authenticated.

## What it demonstrates

- T3N testnet connection and DID authentication
- Validation of a manual-QA finding before it becomes an evidence record
- A timestamped local record that can be passed to a later reporting workflow

The sample finding is fictional and exists only to demonstrate the format.

## Run locally

1. Install dependencies: `npm install`
2. In the same terminal session, set `T3N_API_KEY` to your saved sandbox key.
3. Run the connection check: `npm start`
4. Run the QA evidence demo: `npx tsx qa-evidence-agent.ts`

The demo prints a JSON record containing the authenticated testnet DID, timestamp, and validated sample finding.

## Safe boundaries

- Testnet only
- No customer data or real production bugs in this sample
- No wallet connection, private key, seed phrase, payment, or transaction is requested
- API keys stay in the local environment and are never committed
