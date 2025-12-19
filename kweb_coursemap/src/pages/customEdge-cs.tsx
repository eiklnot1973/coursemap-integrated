import { getBezierPath, BaseEdge, type EdgeProps, type Edge } from '@xyflow/react';

type EmptyEdge = Edge<{ }, 'empty'>;
 
function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd
}: EdgeProps<EmptyEdge>) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
 
  return <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />;
}

export default CustomEdge