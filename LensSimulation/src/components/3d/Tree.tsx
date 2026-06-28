import type { ThreeEvent } from '@react-three/fiber';

export const Tree = ({ position, onClick }: { position: [number, number, number], onClick?: (e: ThreeEvent<MouseEvent>) => void }) => (
  <group position={position} onClick={onClick}>
    <mesh position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
      <meshLambertMaterial color="#78350f" />
    </mesh>
    <mesh position={[0, 3.5, 0]}>
      <coneGeometry args={[1.5, 2, 8]} />
      <meshLambertMaterial color="#064e3b" />
    </mesh>
    <mesh position={[0, 4.5, 0]}>
      <coneGeometry args={[1.2, 1.8, 8]} />
      <meshLambertMaterial color="#059669" />
    </mesh>
    <mesh position={[0, 5.3, 0]}>
      <coneGeometry args={[0.9, 1.5, 8]} />
      <meshLambertMaterial color="#10b981" />
    </mesh>
  </group>
);
