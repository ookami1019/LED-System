import type { ThreeEvent } from '@react-three/fiber';

export const Human = ({ position, onClick }: { position: [number, number, number], onClick?: (e: ThreeEvent<MouseEvent>) => void }) => (
  <group position={position} onClick={onClick}>
    {/* ===== 頭部 ===== */}
    <mesh position={[0, 1.5, 0]}>
      <sphereGeometry args={[0.15, 24, 24]} />
      <meshLambertMaterial color="#fbbcaa" />
    </mesh>

    {/* ===== 顔パーツ（頭中心 [0,1.5,0] 相対） ===== */}
    {/* 左まゆ毛 */}
    <mesh position={[-0.055, 1.565, 0.130]} rotation={[0, 0, 0.15]}>
      <boxGeometry args={[0.058, 0.013, 0.010]} />
      <meshLambertMaterial color="#6b3e26" />
    </mesh>
    {/* 右まゆ毛 */}
    <mesh position={[0.055, 1.565, 0.130]} rotation={[0, 0, -0.15]}>
      <boxGeometry args={[0.058, 0.013, 0.010]} />
      <meshLambertMaterial color="#6b3e26" />
    </mesh>

    {/* 左目・白目 */}
    <mesh position={[-0.054, 1.528, 0.128]}>
      <sphereGeometry args={[0.030, 12, 12]} />
      <meshLambertMaterial color="#f8f8f8" />
    </mesh>
    {/* 左目・虹彩 */}
    <mesh position={[-0.054, 1.528, 0.153]}>
      <sphereGeometry args={[0.019, 10, 10]} />
      <meshLambertMaterial color="#1a4e8a" />
    </mesh>
    {/* 左目・瞳孔 */}
    <mesh position={[-0.054, 1.528, 0.162]}>
      <sphereGeometry args={[0.010, 8, 8]} />
      <meshLambertMaterial color="#0a0a0a" />
    </mesh>

    {/* 右目・白目 */}
    <mesh position={[0.054, 1.528, 0.128]}>
      <sphereGeometry args={[0.030, 12, 12]} />
      <meshLambertMaterial color="#f8f8f8" />
    </mesh>
    {/* 右目・虹彩 */}
    <mesh position={[0.054, 1.528, 0.153]}>
      <sphereGeometry args={[0.019, 10, 10]} />
      <meshLambertMaterial color="#1a4e8a" />
    </mesh>
    {/* 右目・瞳孔 */}
    <mesh position={[0.054, 1.528, 0.162]}>
      <sphereGeometry args={[0.010, 8, 8]} />
      <meshLambertMaterial color="#0a0a0a" />
    </mesh>

    {/* 鼻（最もカメラ側に突出） */}
    <mesh position={[0, 1.492, 0.158]}>
      <sphereGeometry args={[0.022, 10, 10]} />
      <meshLambertMaterial color="#e8937a" />
    </mesh>

    {/* 口・上唇 */}
    <mesh position={[0, 1.460, 0.135]}>
      <boxGeometry args={[0.072, 0.016, 0.012]} />
      <meshLambertMaterial color="#c0555a" />
    </mesh>
    {/* 口・下唇 */}
    <mesh position={[0, 1.447, 0.133]}>
      <boxGeometry args={[0.066, 0.012, 0.010]} />
      <meshLambertMaterial color="#a84a4e" />
    </mesh>

    {/* ===== 胴体 ===== */}
    <mesh position={[0, 1.0, 0]}>
      <cylinderGeometry args={[0.2, 0.18, 0.7, 16]} />
      <meshLambertMaterial color="#3b82f6" />
    </mesh>
    {/* 腕（左） */}
    <mesh position={[-0.3, 1.0, 0]} rotation={[0, 0, Math.PI / 12]}>
      <cylinderGeometry args={[0.06, 0.05, 0.6, 8]} />
      <meshLambertMaterial color="#fbbcaa" />
    </mesh>
    {/* 腕（右） */}
    <mesh position={[0.3, 1.0, 0]} rotation={[0, 0, -Math.PI / 12]}>
      <cylinderGeometry args={[0.06, 0.05, 0.6, 8]} />
      <meshLambertMaterial color="#fbbcaa" />
    </mesh>
    {/* 脚（左） */}
    <mesh position={[-0.1, 0.35, 0]}>
      <cylinderGeometry args={[0.08, 0.07, 0.7, 8]} />
      <meshLambertMaterial color="#1e293b" />
    </mesh>
    {/* 脚（右） */}
    <mesh position={[0.1, 0.35, 0]}>
      <cylinderGeometry args={[0.08, 0.07, 0.7, 8]} />
      <meshLambertMaterial color="#1e293b" />
    </mesh>
  </group>
);
