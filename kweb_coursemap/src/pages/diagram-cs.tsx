import { useState, useCallback, useEffect } from 'react'
import {
  Background, BackgroundVariant,
  Controls, MiniMap, Panel,
  ReactFlow, addEdge, applyNodeChanges, applyEdgeChanges,
  type Node, type Edge, type FitViewOptions,
  type OnConnect, type OnNodesChange,
  type OnEdgesChange, type OnNodeDrag, type DefaultEdgeOptions,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

import {
  nodes as initialNodes,
  edges as initialEdges,
} from './initial-elements'

import CustomNode from './customNode-cs'
import CustomEdge from './customEdge-cs'

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log('drag event', node.data);
};

function DiagramCS({ setIsModalOpen }: { setIsModalOpen: (courseName: string) => void }) {

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [displayMode, setDisplayMode] = useState(1);

  const [tagFirst, setTagFirst] = useState(true);
  const [tagSecond, setTagSecond] = useState(true);
  const [tagThird, setTagThird] = useState(true);
  const [tagFourth, setTagFourth] = useState(true);

  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    setNodes((nds) => nds.map((node) => {
      const tags = Array.isArray(node.data.tags) ? node.data.tags : [];
      const label = typeof node.data.label === 'string' ? node.data.label : '';
      if (((tagFirst && tags.includes('1')) ||
          (tagSecond && tags.includes('2')) ||
          (tagThird && tags.includes('3')) ||
          (tagFourth && tags.includes('4')))
          && label.indexOf(filterText) !== -1) {
        return { ...node, hidden: displayMode === 1 ? false : false, data: { ...node.data, displayMode: displayMode, isSelected: true } };
      }
      return { ...node, hidden: displayMode === 1 ? true : false, data: { ...node.data, displayMode: displayMode, isSelected: false } };
    }));
  }, [tagFirst, tagSecond, tagThird, tagFourth, filterText, displayMode]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [setEdges],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edgesSnapshot) => addEdge(connection, edgesSnapshot)),
    [setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.data && typeof node.data.label === 'string') { setIsModalOpen(node.data.label); }
  }, [setIsModalOpen]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeClick={onNodeClick}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDrag={onNodeDrag}
      fitView
      fitViewOptions={fitViewOptions}
      defaultEdgeOptions={defaultEdgeOptions}
    >
      <Controls />
      <MiniMap nodeStrokeWidth={3} zoomable pannable />
      <Panel position="top-left">
        <button onClick={() => setDisplayMode(1)} style={{ fontSize: '12px', border: '1px solid #333' }}>모드 1</button>
        <button onClick={() => setDisplayMode(2)} style={{ fontSize: '12px', border: '1px solid #333' }}>모드 2</button>
        <button onClick={() => setDisplayMode(3)} style={{ fontSize: '12px', border: '1px solid #333' }}>모드 3</button>
        <form><input type="text" value={filterText} placeholder="검색..." onChange={(e) => setFilterText(e.target.value)}/></form>
        <div>
          1학년 과목
          <input id="ishidden" type="checkbox" checked={tagFirst} onChange={(event) => setTagFirst(event.target.checked)} />
        </div>
        <div>
          2학년 과목
          <input id="ishidden" type="checkbox" checked={tagSecond} onChange={(event) => setTagSecond(event.target.checked)} />
        </div>
        <div>
          3학년 과목
          <input id="ishidden" type="checkbox" checked={tagThird} onChange={(event) => setTagThird(event.target.checked)} />
        </div>
        <div>
          4학년 과목
          <input id="ishidden" type="checkbox" checked={tagFourth} onChange={(event) => setTagFourth(event.target.checked)} />
        </div>
      </Panel>
      <Background color="#ccc" variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}

export default DiagramCS