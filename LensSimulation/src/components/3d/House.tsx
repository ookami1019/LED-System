import type { ThreeEvent } from '@react-three/fiber';

export const House = ({ position, onClick }: { position: [number, number, number], onClick?: (e: ThreeEvent<MouseEvent>) => void }) => (
  <group position={position} rotation={[0, -Math.PI / 16, 0]} onClick={onClick}>
    {/* 1階建ての家としての高さ（3.5m） */}
    <mesh position={[0, 1.75, 0]}>
      <boxGeometry args={[6, 3.5, 5]} />
      <meshLambertMaterial color="#cbd5e1" />
    </mesh>
    {/* 屋根 */}
    <mesh position={[0, 4.75, 0]} rotation={[0, Math.PI / 4, 0]}>
      <coneGeometry args={[5, 2.5, 4]} />
      <meshLambertMaterial color="#7f1d1d" />
    </mesh>
    {/* ドア (高さ2.1m, 幅1.0m) */}
    <mesh position={[0, 1.05, 2.51]}>
      <boxGeometry args={[1.0, 2.1, 0.1]} />
      <meshLambertMaterial color="#451a03" />
    </mesh>
    {/* 左の窓 (中心の高さ1.5m) */}
    <mesh position={[-1.5, 1.5, 2.51]}>
      <boxGeometry args={[1, 1.2, 0.1]} />
      <meshLambertMaterial color="#bae6fd" />
    </mesh>
    {/* 右の窓 (中心の高さ1.5m) */}
    <mesh position={[1.5, 1.5, 2.51]}>
      <boxGeometry args={[1, 1.2, 0.1]} />
      <meshLambertMaterial color="#bae6fd" />
    </mesh>
  </group>
);
