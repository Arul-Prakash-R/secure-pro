import { URLScanResult, ThreatLevel } from "@/types/security";

const PHISHING_PATTERNS = [
  /paypal.*verify/i,
  /amazon.*account.*suspend/i,
  /banking.*login.*urgent/i,
  /click.*here.*prize/i,
  /verify.*account.*now/i,
  /urgent.*action.*required/i,
  /suspended.*account/i,
  /confirm.*identity/i,
  /unusual.*activity/i,
  /security.*alert.*verify/i,
  /apple.*id.*locked/i,
  /google.*verify.*account/i,
  /netflix.*payment.*failed/i,
  /tax.*refund.*claim/i,
  /lottery.*winner/i,
];

const SUSPICIOUS_DOMAINS = [
  "bit.ly",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "t.co",
];

const MALICIOUS_KEYWORDS = [
  "hack",
  "crack",
  "keygen",
  "trojan",
  "backdoor",
  "exploit",
  "malware",
  "virus",
];

export function scanURL(url: string): URLScanResult {
  const threats: string[] = [];
  let isSafe = true;
  let threatLevel: ThreatLevel = "safe";

  try {
    const urlObj = new URL(url);
    
    if (urlObj.protocol !== "https:") {
      threats.push("Insecure connection (not HTTPS)");
      isSafe = false;
      threatLevel = "medium";
    }

    for (const pattern of PHISHING_PATTERNS) {
      if (pattern.test(url)) {
        threats.push("Potential phishing attempt detected");
        isSafe = false;
        threatLevel = "critical";
        break;
      }
    }

    const hostname = urlObj.hostname.toLowerCase();
    if (SUSPICIOUS_DOMAINS.some(domain => hostname.includes(domain))) {
      threats.push("URL shortener or suspicious domain");
      if (threatLevel === "safe") threatLevel = "low";
    }

    for (const keyword of MALICIOUS_KEYWORDS) {
      if (url.toLowerCase().includes(keyword)) {
        threats.push("Suspicious keywords detected");
        isSafe = false;
        threatLevel = "high";
        break;
      }
    }

    const suspiciousChars = /[^\x00-\x7F]/g.test(hostname);
    if (suspiciousChars) {
      threats.push("URL contains suspicious characters");
      isSafe = false;
      threatLevel = "high";
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
      threats.push("Direct IP address instead of domain name");
      if (threatLevel === "safe") threatLevel = "low";
    }

  } catch {
    threats.push("Invalid or malformed URL");
    isSafe = false;
    threatLevel = "medium";
  }

  let recommendation = "";
  if (isSafe) {
    recommendation = "This URL appears to be safe. Proceed with normal caution.";
  } else if (threatLevel === "critical" || threatLevel === "high") {
    recommendation = "DO NOT VISIT this URL. It shows signs of phishing or malicious intent.";
  } else {
    recommendation = "Exercise caution when visiting this URL. Verify the source.";
  }

  return {
    url,
    isSafe,
    threatLevel,
    threats: threats.length > 0 ? threats : ["No threats detected"],
    recommendation,
  };
}

export function calculateSecurityScore(
  threatsBlocked: number,
  activeThreats: number
): number {
  let score = 100;
  
  score -= activeThreats * 15;
  score = Math.max(0, Math.min(100, score));
  
  return score;
}

export function getSecurityLevel(score: number): ThreatLevel {
  if (score >= 90) return "safe";
  if (score >= 70) return "low";
  if (score >= 50) return "medium";
  if (score >= 30) return "high";
  return "critical";
}

export function getThreatColor(level: ThreatLevel): string {
  switch (level) {
    case "safe":
      return "#10b981";
    case "low":
      return "#3b82f6";
    case "medium":
      return "#f59e0b";
    case "high":
      return "#f97316";
    case "critical":
      return "#ef4444";
  }
}

export function getThreatLabel(level: ThreatLevel): string {
  switch (level) {
    case "safe":
      return "Safe";
    case "low":
      return "Low Risk";
    case "medium":
      return "Medium Risk";
    case "high":
      return "High Risk";
    case "critical":
      return "Critical";
  }
}
