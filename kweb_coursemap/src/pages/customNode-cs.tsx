import { useState } from 'react'
import { Handle, Position, NodeToolbar } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'
import './customNode.css'

import MapPinButton from './mapPinIcon'

type InfoNode = Node<{ label: string, preRequisite: string[], postRequisite: string[], displayMode: number, isSelected: boolean }, 'info'>;

function CustomNode({ data }: NodeProps<InfoNode>) {

  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => { setShowTooltip(true); };
  const handleMouseLeave = () => { setShowTooltip(false); };
  const handleClick = () => { ; };

  const isDimmed = (data.displayMode === 2) ? !data.isSelected : false;

  return (
    <>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}
        style={{
          width: '150px', display: 'flex',
          justifyContent: 'center', alignItems: 'center', textAlign: 'center',
          borderRadius: '8px', padding: '10px', fontSize: '12px',
          border: '1px solid #333', backgroundColor: '#f1f1f1', color: 'black',
          opacity: isDimmed ? 0.3 : 1
        }}>
        <div>{data.label}</div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
      <ToolTip showTooltip={showTooltip} preReqs={data.preRequisite} postReqs={data.postRequisite} />
      { (data.displayMode === 3 && data.isSelected) && <div className="mapPin"><MapPinButton onClick={() => {}} /></div> }
    </>
  );
}

function ToolTip({ showTooltip, preReqs, postReqs }: { showTooltip: boolean; preReqs: string[]; postReqs: string[] }) {

  const preReqsElements = preReqs.map((req, index) => { return <li key={index}>{req}</li>; });
  const postReqsElements = postReqs.map((req, index) => { return <li key={index}>{req}</li>; });

  return (
    <NodeToolbar isVisible={showTooltip} position={Position.Bottom} offset={5}>
      <div className="tooltip-box">
        <h3>추천 선이수 과목</h3>
        <ul>{preReqsElements}</ul>
        <h3>추천 후이수 과목</h3>
        <ul>{postReqsElements}</ul>
      </div>
    </NodeToolbar>
  );
}

export default CustomNode