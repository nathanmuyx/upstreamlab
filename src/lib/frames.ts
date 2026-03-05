export type FrameNode = {
  id: string; // e.g. "1:2" like Figma node IDs
  name: string;
  description?: string;
  tags?: string[];
  specs?: {
    spacing?: Record<string, string>;
    colors?: Record<string, string>;
    typography?: Record<string, string>;
    tokens?: Record<string, string>;
  };
  children?: string[]; // child node IDs
  parentId?: string;
};

export type FrameRegistry = Record<string, FrameNode>;

// Build a flat URL-safe slug from node ID: "1:2" -> "1-2"
export function nodeIdToParam(id: string): string {
  return id.replace(/:/g, "-");
}

export function paramToNodeId(param: string): string {
  return param.replace(/-/g, ":");
}

// Shareable docs link — navigates to this frame in the docs UI
export function getNodeUrl(projectSlug: string, nodeId: string): string {
  return `/projects/${projectSlug}/docs?node-id=${nodeIdToParam(nodeId)}`;
}

// Standalone frame URL — this is what you paste into Figma's html.to.design plugin
// It renders just the frame content on a clean white page, no app chrome
export function getFrameUrl(projectSlug: string, nodeId: string): string {
  return `/projects/${projectSlug}/docs/frame/${nodeIdToParam(nodeId)}`;
}
