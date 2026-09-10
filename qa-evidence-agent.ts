import {
  T3nClient,
  createEthAuthInput,
  eth_get_address,
  fetchTrustedManifest,
  loadWasmComponent,
  metamask_sign,
  setEnvironment,
} from "@terminal3/t3n-sdk";

type QaFinding = {
  title: string;
  severity: "low" | "medium" | "high";
  expected: string;
  actual: string;
  reproSteps: string[];
};

const apiKey = process.env.T3N_API_KEY;
if (!apiKey) {
  throw new Error("T3N_API_KEY is not set. Keep it outside the repository and add it only for this local sandbox run.");
}

const finding: QaFinding = {
  title: "Search does not preserve the selected market after refresh",
  severity: "medium",
  expected: "The selected market remains selected after a browser refresh.",
  actual: "The screen returns to the default market after refresh.",
  reproSteps: ["Open the sandbox app", "Select a non-default market", "Refresh the page"],
};

function validateFinding(value: QaFinding): string[] {
  const issues: string[] = [];
  if (value.title.trim().length < 8) issues.push("Title is too short.");
  if (!value.expected.trim()) issues.push("Expected result is required.");
  if (!value.actual.trim()) issues.push("Actual result is required.");
  if (value.reproSteps.length < 2) issues.push("At least two reproduction steps are required.");
  return issues;
}

function createEvidenceRecord(did: string, value: QaFinding) {
  return {
    did,
    environment: "testnet",
    createdAt: new Date().toISOString(),
    finding: value,
    note: "Local sandbox evidence only. This script does not submit data, move funds, or access a wallet.",
  };
}

const validationIssues = validateFinding(finding);
if (validationIssues.length) {
  throw new Error(`QA record is incomplete: ${validationIssues.join(" ")}`);
}

setEnvironment("testnet");
const wasmComponent = await loadWasmComponent();
const address = eth_get_address(apiKey);
const t3n = new T3nClient({
  trustAnchor: await fetchTrustedManifest("testnet"),
  wasmComponent,
  handlers: { EthSign: metamask_sign(address, undefined, apiKey) },
});

await t3n.handshake();
const did = await t3n.authenticate(createEthAuthInput(address));
console.log(JSON.stringify(createEvidenceRecord(did.value, finding), null, 2));
