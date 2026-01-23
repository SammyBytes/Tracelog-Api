export interface ParsedCommit {
  type: string;
  module: string;
  message: string;
}

export const parseCommit = (fullMessage: string): ParsedCommit => {
  // Regex: type(module): message
  // Capture 1: type, Capture 2: module (optional), Capture 3: message
  const pattern = /^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/;

  const match = fullMessage.trim().match(pattern);

  if (!match) {
    return {
      type: "other",
      module: "general",
      message: fullMessage.trim(),
    };
  }

  return {
    type: match[1]!.toLowerCase(), // feat, fix...
    module: match[2]?.toLowerCase() || "general", // auth, ui...
    message: match[3]!.trim(), // message
  };
};
