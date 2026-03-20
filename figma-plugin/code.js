// upstream-lab Figma plugin — creates auto-layout frames from upstream-lab frame data

figma.showUI(__html__, { width: 320, height: 200 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-frame") {
    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
      await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });

      const root = buildNode(msg.layout);
      figma.currentPage.appendChild(root);

      // Center in viewport
      figma.viewport.scrollAndZoomIntoView([root]);
      figma.currentPage.selection = [root];

      figma.ui.postMessage({ type: "done", name: msg.frameName });
    } catch (err) {
      figma.ui.postMessage({ type: "error", message: String(err) });
    }
  }
};

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
}

function buildNode(node) {
  if (node.type === "FRAME") {
    const frame = figma.createFrame();
    frame.name = node.name || "Frame";

    // Auto layout
    frame.layoutMode = node.layout === "HORIZONTAL" ? "HORIZONTAL" : "VERTICAL";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";

    if (node.width) {
      frame.resize(node.width, node.height || 100);
      frame.counterAxisSizingMode = "FIXED";
      if (node.height) frame.primaryAxisSizingMode = "FIXED";
    }

    frame.itemSpacing = node.gap || 0;

    // Padding
    if (node.padding) {
      frame.paddingTop = node.padding[0];
      frame.paddingRight = node.padding[1];
      frame.paddingBottom = node.padding[2];
      frame.paddingLeft = node.padding[3];
    }

    // Fill
    if (node.fill) {
      frame.fills = [{ type: "SOLID", color: hexToRgb(node.fill) }];
    } else {
      frame.fills = [];
    }

    // Stroke
    if (node.stroke) {
      frame.strokes = [{ type: "SOLID", color: hexToRgb(node.stroke) }];
      frame.strokeWeight = 1;
    }

    // Corner radius
    if (node.cornerRadius) {
      frame.cornerRadius = node.cornerRadius;
    }

    // Children
    if (node.children) {
      for (const child of node.children) {
        const childNode = buildNode(child);
        frame.appendChild(childNode);
      }
    }

    return frame;
  }

  if (node.type === "TEXT") {
    const text = figma.createText();
    text.name = node.name || "Text";
    text.characters = node.content || "";
    text.fontSize = node.fontSize || 14;

    // Map weight to Inter style
    const weight = node.fontWeight || 400;
    let style = "Regular";
    if (weight >= 700) style = "Bold";
    else if (weight >= 600) style = "Semi Bold";
    else if (weight >= 500) style = "Medium";
    text.fontName = { family: "Inter", style };

    if (node.fill) {
      text.fills = [{ type: "SOLID", color: hexToRgb(node.fill) }];
    }

    return text;
  }

  if (node.type === "RECT") {
    const rect = figma.createRectangle();
    rect.name = node.name || "Rectangle";
    rect.resize(node.width || 100, node.height || 100);

    if (node.fill) {
      rect.fills = [{ type: "SOLID", color: hexToRgb(node.fill) }];
    }
    if (node.cornerRadius) {
      rect.cornerRadius = node.cornerRadius;
    }
    if (node.stroke) {
      rect.strokes = [{ type: "SOLID", color: hexToRgb(node.stroke) }];
      rect.strokeWeight = 1;
    }

    return rect;
  }

  if (node.type === "ELLIPSE") {
    const ellipse = figma.createEllipse();
    ellipse.name = node.name || "Ellipse";
    ellipse.resize(node.width || 100, node.height || 100);

    if (node.fill) {
      ellipse.fills = [{ type: "SOLID", color: hexToRgb(node.fill) }];
    }

    return ellipse;
  }

  // Fallback
  const rect = figma.createRectangle();
  rect.name = node.name || "Unknown";
  rect.resize(50, 50);
  return rect;
}
