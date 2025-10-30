import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

function generateTree(data, parentId = null, level = 0, position = { x: 0, y: 0 }) {
  const nodes = [];
  const edges = [];
  const nodeId = `${parentId || "root"}-${level}-${Math.random().toString(36).substring(2, 7)}`;

  const nodeType = typeof data;
  const label =
    data === null
      ? "null"
      : Array.isArray(data)
      ? "Array"
      : nodeType === "object"
      ? "Object"
      : String(data);

  // Color code nodes by type
  const colors = {
    object: "#4a6cf7",
    array: "#10b981",
    string: "#f59e0b",
    number: "#3b82f6",
    boolean: "#ec4899",
    null: "#6b7280",
  };

  const color =
    Array.isArray(data) ? colors.array : colors[nodeType] || colors.string;

  nodes.push({
    id: nodeId,
    data: { label },
    position: { x: position.x, y: position.y },
    style: {
      background: color,
      color: "white",
      padding: 10,
      borderRadius: 10,
      fontSize: 13,
      minWidth: 80,
      textAlign: "center",
      boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
    },
  });

  if (typeof data === "object" && data !== null) {
    const entries = Array.isArray(data)
      ? data.entries()
      : Object.entries(data);

    let offsetX = position.x - (entries.length * 150) / 2;

    for (const [key, value] of entries) {
      const childPos = { x: offsetX, y: position.y + 120 };
      const child = generateTree(value, nodeId, level + 1, childPos);

      nodes.push(...child.nodes);
      edges.push({
        id: `${nodeId}-${child.nodes[0].id}`,
        source: nodeId,
        target: child.nodes[0].id,
        label: key,
        type: "smoothstep",
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#9ca3af" },
      });
      edges.push(...child.edges);
      offsetX += 150;
    }
  }

  return { nodes, edges };
}

export default function JsonTreeDiagram({ jsonData }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!jsonData) return { nodes: [], edges: [] };
    return generateTree(jsonData);
  }, [jsonData]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const layoutedNodes = nodes.map((node) => ({
    ...node,
    position: { ...node.position, x: node.position.x + 300 },
  }));

  return (
    <div style={{ width: "100%", height: "70vh", background: "#f9fbff", borderRadius: "12px" }}>
      <ReactFlow
        nodes={layoutedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#e2e8f0" />
        <MiniMap nodeStrokeColor="#4a6cf7" nodeColor="#c7d2fe" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
