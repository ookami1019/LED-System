import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { PerspectiveCamera, Text } from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing';
import { Human } from './3d/Human';
import { Tree } from './3d/Tree';
import { House } from './3d/House';
import { Mountain } from './3d/Mountain';
import { Bush } from './3d/Bush';
import { SportsCar } from './3d/SportsCar';

interface SceneContentProps {
  vFov: number;
  unit: 'm' | 'ft';
  fNumber: number;
  focusDistanceM: number;
  nearLimitM: number;
  farLimitM: number;
  isAutoFocus: boolean;
  isDofEnabled: boolean;
  onFocusUpdate: (dist: number) => void;
}

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

const SceneContent: React.FC<SceneContentProps> = ({ vFov, unit, fNumber, focusDistanceM, isAutoFocus, isDofEnabled, onFocusUpdate }) => {
  // DepthOfFieldパラメーターを計算
  const dofParams = useMemo(() => {
    const focusDistance = isAutoFocus ? 15 : focusDistanceM;
    const focusRange = Math.min(focusDistance * focusDistance * 0.004 / fNumber + 0.3, 50);
    const bokehScale = Math.min(12 / fNumber, 10);
    return { focusDistance, focusRange, bokehScale };
  }, [fNumber, focusDistanceM, isAutoFocus]);

  const handleObjectClick = (e: ThreeEvent<MouseEvent>, targetPosition: [number, number, number]) => {
    e.stopPropagation(); // 複数オブジェクトのクリック重複を防ぐ
    // カメラは [0, 1.6, 0] にある
    const dx = targetPosition[0];
    const dy = targetPosition[1] - 1.6;
    const dz = targetPosition[2];
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
    onFocusUpdate(Math.round(dist * 100) / 100);
  };

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

      {/* インタラクティブな3Dオブジェクト */}
      <SportsCar position={[4, 0, -10]} rotation={[0, -Math.PI / 6, 0]} onClick={(e) => handleObjectClick(e, [4, 0.6, -10])} />
      <Human position={[0, 0, -15.15]} onClick={(e) => handleObjectClick(e, [0, 1.5, -15.15])} />
      <Tree position={[5, 0, -30]} onClick={(e) => handleObjectClick(e, [5, 2.5, -30])} />
      <Bush position={[-6, 0, -40]} onClick={(e) => handleObjectClick(e, [-6, 0.4, -40])} />
      <House position={[-8, 0, -60]} onClick={(e) => handleObjectClick(e, [-8, 2.0, -60])} />
      <Tree position={[6, 0, -80]} onClick={(e) => handleObjectClick(e, [6, 2.5, -80])} />
      <Mountain position={[0, 0, -130]} onClick={(e) => handleObjectClick(e, [0, 15, -130])} />

      {/* ポストプロセス: 被写界深度（DoF）エフェクト */}
      {isDofEnabled && (
        <EffectComposer>
          <DepthOfField
            focusDistance={dofParams.focusDistance}
            focusRange={dofParams.focusRange}
            bokehScale={dofParams.bokehScale}
            height={720}
          />
        </EffectComposer>
      )}
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
  isDofEnabled: boolean;
  onFocusUpdate: (dist: number) => void;
}

export const CameraView3D: React.FC<CameraView3DProps> = ({ vFov, aspect, targetRatioStr, unit, fNumber, focusDistanceM, nearLimitM, farLimitM, isAutoFocus, isDofEnabled, onFocusUpdate }) => {
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
            isDofEnabled={isDofEnabled}
            onFocusUpdate={onFocusUpdate}
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
