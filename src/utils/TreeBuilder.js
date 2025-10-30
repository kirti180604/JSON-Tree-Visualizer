let nodeIdCounter = 0;

function genId() {
  nodeIdCounter += 1;
  return `n${nodeIdCounter}`;
}

function isPrimitive(value) {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function buildTreeNodesEdges(json) {
  nodeIdCounter = 0;
  const nodes = [];
  const edges = [];

  const horizontalSpacing = 200;
  const verticalSpacing = 150;

  const columnOffsets = {};

  function registerPos(depth) {
    if (!(depth in columnOffsets)) columnOffsets[depth] = 0;
    const x = columnOffsets[depth] * horizontalSpacing;
    columnOffsets[depth] += 1;
    return x;
  }

  function walk(value, key, parentId, depth) {
    const id = genId();
    const posX = registerPos(depth);
    const posY = depth * verticalSpacing;

    const node = {
      id,
      position: { x: posX, y: posY },
      data: {
        label:
          isPrimitive(value) || Array.isArray(value)
            ? `${key}: ${JSON.stringify(value)}`
            : key,
      },
      style: {
        padding: 10,
        borderRadius: 8,
        background:
          typeof value === "object"
            ? Array.isArray(value)
              ? "#1abc9c"
              : "#6c5ce7"
            : "#f4b942",
        color: "white",
        minWidth: 120,
        textAlign: "center",
        fontSize: 13,
      },
    };

    nodes.push(node);

    if (parentId) {
      edges.push({
        id: `e${parentId}-${id}`,
        source: parentId,
        target: id,
        animated: true,
      });
    }

    if (typeof value === "object" && value !== null) {
      const entries = Array.isArray(value)
        ? value.map((v, i) => [i, v])
        : Object.entries(value);

      entries.forEach(([k, v]) => walk(v, k, id, depth + 1));
    }
  }

  walk(json, "root", null, 0);
  return { nodes, edges };
}
