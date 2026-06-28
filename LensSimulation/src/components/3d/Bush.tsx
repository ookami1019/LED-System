import type { ThreeEvent } from '@react-three/fiber';

export const Bush = ({ position, onClick }: { position: [number, number, number], onClick?: (e: ThreeEvent<MouseEvent>) => void }) => (
  <group position={position} onClick={onClick}>
    <mesh position={[0, 0.4, 0]}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshLambertMaterial color="#047857" />
    </mesh>
    <mesh position={[-0.3, 0.3, 0.2]}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshLambertMaterial color="#059669" />
    </mesh>
    <mesh position={[0.3, 0.3, -0.1]}>
      <sphereGeometry args={[0.4, 16, 16]} />
      <meshLambertMaterial color="#10b981" />
    </mesh>
  </group>
);
