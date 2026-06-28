import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Text } from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';

interface SceneContentProps {
  vFov: number;
  unit: 'm' | 'ft';
  fNumber: number;
  focusDistanceM: number;
  nearLimitM: number;
  farLimitM: number;
  isAutoFocus: boolean;
}

const Human = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* ===== 頭部 ===== */}
    {/* グループを z=-15.15 に配置することで頭前面（カメラ側）が z=-15 になる */}
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


const Tree = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
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

const House = ({ position }: { position: [number, number, number] }) => (
  <group position={position} rotation={[0, -Math.PI / 16, 0]}>
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

const Mountain = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
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

const Bush = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
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

const SportsCar = ({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) => (
  <group position={position} rotation={rotation || [0, 0, 0]}>
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

const DistanceMarkers = ({ unit }: { unit: 'm' | 'ft' }) => {
  const distances = unit === 'm' 
    ? [5, 10, 15, 20, 30, 40, 50, 60, 80, 100]
    : [10, 20, 30, 50, 100, 150, 200, 250, 300, 330];

  return (
    <group>
      {distances.map((d, index) => {
        const isRight = index % 2 === 0;
        const xAbs = 3.2 - (index * 0.15); 
        const xOffset = isRight ? xAbs : -xAbs;
        
        const poleHeight = 0.8;
        const poleY = poleHeight / 2;
        const boardY = poleHeight + 0.2;

        const zDist = unit === 'm' ? d : d / 3.28084;
        const labelText = unit === 'm' ? `${d}m` : `${d}ft`;

        return (
          <group key={d} position={[xOffset, 0, -zDist]}>
            <mesh position={[-xOffset, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[10, 0.1]} />
              <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
            </mesh>

            <mesh position={[0, poleY, 0]}>
              <cylinderGeometry args={[0.02, 0.03, poleHeight, 8]} />
              <meshLambertMaterial color="#64748b" />
            </mesh>

            <mesh position={[0, boardY, 0]}>
              <boxGeometry args={[1.0, 0.45, 0.04]} />
              <meshLambertMaterial color="#1e293b" />
            </mesh>

            <Text 
              position={[0, boardY, 0.025]} 
              fontSize={0.28}
              color="#bae6fd"
              outlineWidth={0.015}
              outlineColor="#0f172a"
              anchorX="center"
              anchorY="middle"
            >
              {labelText}
            </Text>
          </group>
        );
      })}
    </group>
  );
};

const SceneContent: React.FC<SceneContentProps> = ({ vFov, unit, fNumber, focusDistanceM, isAutoFocus }) => {
  // DepthOfFieldパラメーターを計算
  // postprocessing v6 では focusDistance / focusRange はワールド単位（m）
  const dofParams = useMemo(() => {
    // --- focusDistance: フォーカス距離（ワールド単位・m）---
    // AF ON: 人物の頭部中心までの実距離
    //   カメラ [0,1.6,0] → 頭部中心 [0,1.5,-15.15]  ≈ 15.15m
    // Manual: カメラ正面にフォーカス距離を設定
    const focusDistance = isAutoFocus ? 15 : focusDistanceM;

    // --- focusRange: 合焦帯の前後半幅（ワールド単位・m）---
    // F 値に反比例: 開放(F1.4)ほど狭く（浅いDoF）、絞り(F22)ほど広い（深いDoF）
    // 実写感覚の調整値:  F1.4→1m  F2.8→2m  F5.6→4m  F11→8m  F22→20m
    const focusRange = Math.min(focusDistance * focusDistance * 0.004 / fNumber + 0.3, 50);

    // --- bokehScale: ボケの強さ ---
    // F値が小さいほど大きいボケ（最大10）
    const bokehScale = Math.min(12 / fNumber, 10);

    return { focusDistance, focusRange, bokehScale };
  }, [fNumber, focusDistanceM, isAutoFocus]);


  return (
    <>
      <PerspectiveCamera 
        makeDefault 
        position={[0, 1.6, 0]} 
        fov={vFov} 
        near={0.1}
        far={200}
      />
      
      <color attach="background" args={['#0f172a']} />
      <fog attach="fog" args={['#0f172a', 60, 160]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={0.8} castShadow />

      <gridHelper args={[200, 40, '#475569', '#1e293b']} />

      <DistanceMarkers unit={unit} />

      {/* 車 (10m, 右側) */}
      <SportsCar position={[4, 0, -10]} rotation={[0, -Math.PI / 6, 0]} />

      {/* 人物 (顔面が15mになるよう z=-15.15 に配置) */}
      <Human position={[0, 0, -15.15]} />

      {/* 木 (30m, 右側) */}
      <Tree position={[5, 0, -30]} />

      {/* 低木 (40m, 左側) */}
      <Bush position={[-6, 0, -40]} />

      {/* 建物 (60m, 左寄り) */}
      <House position={[-8, 0, -60]} />

      {/* 木 (80m, 右側) */}
      <Tree position={[6, 0, -80]} />

      {/* 山 */}
      <Mountain position={[0, 0, -130]} />

      {/* ポストプロセス: 被写界深度（DoF）エフェクト
           postprocessing v6: focusDistance / focusRange はワールド単位（m） */}
      <EffectComposer>
        <DepthOfField
          focusDistance={dofParams.focusDistance}
          focusRange={dofParams.focusRange}
          bokehScale={dofParams.bokehScale}
          height={720}
        />
      </EffectComposer>
    </>
  );
};

interface CameraView3DProps {
  vFov: number;
  aspect: number;
  targetRatioStr: string;
  unit: 'm' | 'ft';
  fNumber: number;
  focusDistanceM: number;
  nearLimitM: number;
  farLimitM: number;
  isAutoFocus: boolean;
}

export const CameraView3D: React.FC<CameraView3DProps> = ({ vFov, aspect, targetRatioStr, unit, fNumber, focusDistanceM, nearLimitM, farLimitM, isAutoFocus }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperSize, setWrapperSize] = useState({ w: 800, h: 400 });

  useEffect(() => {
    if (!wrapperRef.current) return;
    
    setWrapperSize({
      w: wrapperRef.current.clientWidth,
      h: wrapperRef.current.clientHeight
    });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWrapperSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height
        });
      }
    });
    
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // レターボックス用の計算
  let width = '100%';
  let height = '100%';
  
  if (wrapperSize.w > 0 && wrapperSize.h > 0) {
    const wAspect = wrapperSize.w / wrapperSize.h;
    if (aspect > wAspect) {
      height = `${(wrapperSize.w / aspect)}px`;
    } else {
      width = `${(wrapperSize.h * aspect)}px`;
    }
  }

  return (
    <div 
      ref={wrapperRef}
      className="w-full h-full flex bg-black relative items-center justify-center overflow-hidden"
    >
      <div style={{ width, height }}>
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
          <SceneContent
            vFov={vFov}
            unit={unit}
            fNumber={fNumber}
            focusDistanceM={focusDistanceM}
            nearLimitM={nearLimitM}
            farLimitM={farLimitM}
            isAutoFocus={isAutoFocus}
          />
        </Canvas>
      </div>
      {/* アスペクト比表示 */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-md font-mono tracking-wider shadow-lg pointer-events-none">
        {targetRatioStr}
      </div>
      {/* F値・フォーカス距離・ AF状態表示 */}
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-amber-400/20 text-amber-300 text-xs px-2.5 py-1 rounded-md font-mono tracking-wider shadow-lg pointer-events-none flex items-center gap-2">
        {isAutoFocus && (
          <span className="flex items-center gap-1 text-green-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AF
          </span>
        )}
        <span>F{fNumber}</span>
        <span className="text-gray-500">|</span>
        <span>focus {unit === 'm' ? `${focusDistanceM.toFixed(1)}m` : `${(focusDistanceM * 3.28084).toFixed(1)}ft`}</span>
      </div>
    </div>
  );
};
