import { jsPDF } from "jspdf";
import type { RaldIdentity } from "./identity";
import { checkupItems, checkupScore, checkupStatus } from "./checkup";

const GREEN: [number, number, number] = [22, 122, 80];
const GOLD: [number, number, number] = [196, 152, 42];
const RED: [number, number, number] = [196, 52, 42];
const INK: [number, number, number] = [30, 41, 38];
const MUTED: [number, number, number] = [120, 130, 126];

function toneColor(tone: "green" | "gold" | "red"): [number, number, number] {
  return tone === "green" ? GREEN : tone === "gold" ? GOLD : RED;
}

/** Build & download a branded RALD identity + security report. */
export function downloadAccountReport(identity: RaldIdentity) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  let y = 0;

  const score = checkupScore(identity);
  const status = checkupStatus(score);

  // header band
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, W, 110, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("RALD", M, 54);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Identity & Security Report", M, 76);
  doc.setFontSize(9);
  doc.text(
    `Generated ${new Date().toLocaleString()}`,
    W - M,
    76,
    { align: "right" },
  );

  y = 150;

  // identity block
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(identity.displayName || identity.username, M, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(11);
  doc.text(`@${identity.username}`, M, y + 18);

  y += 56;
  const rows: [string, string][] = [
    ["Email", identity.email || "Not set"],
    ["Email verified", identity.email ? (identity.emailVerified ? "Yes" : "No") : "—"],
    ["Phone", identity.phone || "Not set"],
    ["Recovery email", identity.recoveryEmail || "Not set"],
    ["2-Step Verification", identity.twoFactor ? "On" : "Off"],
    ["Identity created", new Date(identity.createdAt).toLocaleDateString()],
  ];
  doc.setFontSize(11);
  rows.forEach(([k, v]) => {
    doc.setTextColor(...MUTED);
    doc.text(k, M, y);
    doc.setTextColor(...INK);
    doc.text(v, M + 160, y);
    y += 22;
  });

  // security score
  y += 18;
  doc.setDrawColor(225, 230, 227);
  doc.line(M, y, W - M, y);
  y += 30;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...INK);
  doc.text("Security Checkup", M, y);
  doc.setTextColor(...toneColor(status.tone));
  doc.text(`${score}% · ${status.label}`, W - M, y, { align: "right" });

  y += 16;
  // progress bar
  const barW = W - M * 2;
  doc.setFillColor(235, 238, 236);
  doc.roundedRect(M, y, barW, 10, 5, 5, "F");
  doc.setFillColor(...toneColor(status.tone));
  doc.roundedRect(M, y, (barW * score) / 100, 10, 5, 5, "F");

  y += 36;
  checkupItems(identity).forEach((item) => {
    doc.setFillColor(...(item.done ? GREEN : [220, 224, 222]));
    doc.circle(M + 6, y - 4, 6, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    if (item.done) doc.text("✓", M + 3.4, y - 1);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(item.label, M + 22, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.setFontSize(10);
    doc.text(item.done ? "Complete" : "Recommended", W - M, y, {
      align: "right",
    });
    doc.text(item.description, M + 22, y + 14);
    y += 36;
  });

  // footer
  const H = doc.internal.pageSize.getHeight();
  doc.setDrawColor(225, 230, 227);
  doc.line(M, H - 56, W - M, H - 56);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Protected by RALD · Built in Africa", M, H - 36);
  doc.text(
    "This report contains your personal identity data. Keep it private.",
    W - M,
    H - 36,
    { align: "right" },
  );

  doc.save(`rald-account-${identity.username}.pdf`);
}
