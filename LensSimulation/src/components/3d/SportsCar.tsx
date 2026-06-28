import type { ThreeEvent } from '@react-three/fiber';

export const SportsCar = ({ position, rotation, onClick }: { position: [number, number, number], rotation?: [number, number, number], onClick?: (e: ThreeEvent<MouseEvent>) => void }) => (
  <group position={position} rotation={rotation || [0, 0, 0]} onClick={onClick}>
    {/* 車体下部 (シャーシ) */}
    <mesh position={[0, 0.35, 0]}>
      <boxGeometry args={[1.8, 0.3, 4.4]} />
      <meshLambertMaterial color="#dc2626" />
    </mesh>
    
    {/* 車体後部 */}
    <mesh position={[0, 0.6, 1.2]}>
      <boxGeometry args={[1.8, 0.3, 2.0]} />
      <meshLambertMaterial color="#b91c1c" />
    </mesh>

    {/* フロントノーズ (少し傾斜をつける) */}
    <mesh position={[0, 0.4, -1.6]} rotation={[-0.1, 0, 0]}>
      <boxGeometry args={[1.8, 0.3, 1.4]} />
      <meshLambertMaterial color="#dc2626" />
    </mesh>

    {/* キャビン (ルーフ周りを少し高くして全高約1.25mに) */}
    <mesh position={[0, 0.95, 0.1]}>
      <boxGeometry args={[1.3, 0.45, 1.6]} />
      <meshLambertMaterial color="#dc2626" />
    </mesh>

    {/* フロントガラス (少し高さを調整) */}
    <mesh position={[0, 0.9, -0.6]} rotation={[-0.45, 0, 0]}>
      <boxGeometry args={[1.2, 0.55, 0.1]} />
      <meshLambertMaterial color="#1e293b" />
    </mesh>

    {/* リアガラス (少し高さを調整) */}
    <mesh position={[0, 0.9, 0.8]} rotation={[0.4, 0, 0]}>
      <boxGeometry args={[1.2, 0.5, 0.1]} />
      <meshLambertMaterial color="#1e293b" />
    </mesh>

    {/* サイドウィンドウ */}
    <mesh position={[-0.66, 0.95, 0.1]}>
      <boxGeometry args={[0.02, 0.35, 1.4]} />
      <meshLambertMaterial color="#1e293b" />
    </mesh>
    <mesh position={[0.66, 0.95, 0.1]}>
      <boxGeometry args={[0.02, 0.35, 1.4]} />
      <meshLambertMaterial color="#1e293b" />
    </mesh>

    {/* フロントグリル (黒) */}
    <mesh position={[0, 0.35, -2.21]}>
      <boxGeometry args={[1.2, 0.15, 0.05]} />
      <meshLambertMaterial color="#0f172a" />
    </mesh>

    {/* ヘッドライト (白/黄色) */}
    <mesh position={[-0.6, 0.45, -2.18]}>
      <boxGeometry args={[0.4, 0.1, 0.05]} />
      <meshBasicMaterial color="#fef08a" />
    </mesh>
    <mesh position={[0.6, 0.45, -2.18]}>
      <boxGeometry args={[0.4, 0.1, 0.05]} />
      <meshBasicMaterial color="#fef08a" />
    </mesh>

    {/* テールランプ (赤発光) */}
    <mesh position={[-0.6, 0.6, 2.21]}>
      <boxGeometry args={[0.5, 0.1, 0.05]} />
      <meshBasicMaterial color="#f87171" />
    </mesh>
    <mesh position={[0.6, 0.6, 2.21]}>
      <boxGeometry args={[0.5, 0.1, 0.05]} />
      <meshBasicMaterial color="#f87171" />
    </mesh>

    {/* リアウィングの支柱 */}
    <mesh position={[-0.6, 0.85, 2.0]}>
      <boxGeometry args={[0.05, 0.25, 0.1]} />
      <meshLambertMaterial color="#0f172a" />
    </mesh>
    <mesh position={[0.6, 0.85, 2.0]}>
      <boxGeometry args={[0.05, 0.25, 0.1]} />
      <meshLambertMaterial color="#0f172a" />
    </mesh>
    
    {/* リアウィング本体 */}
    <mesh position={[0, 0.95, 2.1]}>
      <boxGeometry args={[1.8, 0.04, 0.5]} />
      <meshLambertMaterial color="#0f172a" />
    </mesh>

    {/* サイドミラー */}
    <mesh position={[-0.75, 0.75, -0.3]}>
      <boxGeometry args={[0.2, 0.1, 0.1]} />
      <meshLambertMaterial color="#dc2626" />
    </mesh>
    <mesh position={[0.75, 0.75, -0.3]}>
      <boxGeometry args={[0.2, 0.1, 0.1]} />
      <meshLambertMaterial color="#dc2626" />
    </mesh>

    {/* タイヤ周辺 */}
    {[[-0.95, 0.25, -1.3], [0.95, 0.25, -1.3], [-0.95, 0.25, 1.3], [0.95, 0.25, 1.3]].map((pos, idx) => (
      <group key={idx} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
        {/* タイヤゴム */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 16]} />
          <meshLambertMaterial color="#0f172a" />
        </mesh>
        {/* ホイールリム (銀色) */}
        <mesh position={[0, (pos[0] > 0 ? 0.13 : -0.13), 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
          <meshLambertMaterial color="#cbd5e1" />
        </mesh>
      </group>
    ))}
  </group>
);
