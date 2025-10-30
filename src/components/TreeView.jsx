import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

const Tree = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const buildTree = useCallback(
    (obj, parentId = null, depth = 0, index = 0, xOffset = 0) => {
      const currentId = parentId ? `${parentId}-${index}` : "root";
      const label = Array.isArray(obj)
        ? "Array"
        : typeof obj === "object"
        ? "Object"
        : `${obj}`;

      const currentNode = {
        id: currentId,
        data: { label },
        position: { x: xOffset, y: depth * 160 },
        style: {
          border: "2px solid #007bff",
          borderRadius: 12,
          padding: "10px 15px",
          background: "#fff",
          fontSize: 14,
          width: 150,
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        },
      };

      let result = [currentNode];
      let edgeList = [];

      if (typeof obj === "object" && obj !== null) {
        const entries = Object.entries(obj);
        const totalWidth = entries.length * 200;

        entries.forEach(([key, value], i) => {
          const childOffset = xOffset - totalWidth / 2 + i * 200 + 100;
          const childTree = buildTree(value, currentId, depth + 1, i, childOffset);
          result = [...result, ...childTree.nodes];
          edgeList = [
            ...edgeList,
            ...childTree.edges,
            { id: `${currentId}-${i}`, source: currentId, target: `${currentId}-${i}` },
          ];
        });
      }

      return { nodes: result, edges: edgeList };
    },
    []
  );

  useEffect(() => {
    if (data) {
      const { nodes: builtNodes, edges: builtEdges } = buildTree(data);
      setNodes(builtNodes);
      setEdges(builtEdges);
      // Center and zoom properly after render
      setTimeout(() => fitView({ padding: 0.3, includeHiddenNodes: true }), 600);
    }
  }, [data, buildTree, fitView, setNodes, setEdges]);

  return (
    <div
      style={{
        width: "100%",
        height: "85vh",
        background: "#f9fbff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          width: "95%",
          height: "100%",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnDrag={true}
          panOnScroll={true}
          preventScrolling={false}
          minZoom={0.3}
          maxZoom={2}
        >
          <MiniMap />
          <Controls showInteractive={true} />
          <Background color="#e0e7ff" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
};

const TreeView = ({ data }) => (
  <ReactFlowProvider>
    <Tree data={data} />
  </ReactFlowProvider>
);

export default TreeView;
