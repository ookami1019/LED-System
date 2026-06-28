import type { ThreeEvent } from '@react-three/fiber';

export const Mountain = ({ position, onClick }: { position: [number, number, number], onClick?: (e: ThreeEvent<MouseEvent>) => void }) => (
  <group position={position} onClick={onClick}>
    <mesh position={[0, 15, 0]}>
      <coneGeometry args={[30, 30, 16]} />
      <meshLambertMaterial color="#8493a8" />
    </mesh>
    <mesh position={[18, 10, -5]}>
      <coneGeometry args={[20, 20, 12]} />
      <meshLambertMaterial color="#64748b" />
    </mesh>
    <mesh position={[-15, 12, -2]}>
      <coneGeometry args={[22, 24, 12]} />
      <meshLambertMaterial color="#64748b" />
    </mesh>
    <mesh position={[0, 28, 0]}>
      <coneGeometry args={[4.2, 4, 16]} />
      <meshLambertMaterial color="#f1f5f9" />
    </mesh>
  </group>
);
