import React from 'react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-900/80">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            用語説明
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-100 border-l-4 border-blue-500 pl-3">焦点距離 (Focal Length)</h3>
            <p className="text-sm text-gray-300 leading-relaxed pl-4">
              レンズが光を折り曲げ、センサー上に結像するまでの距離（mm単位）。数値が小さいほど広い範囲が写り（広角）、大きいほど遠くの被写体を大きく捉えます（望遠）。
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-100 border-l-4 border-emerald-500 pl-3">センサーサイズ (Sensor Size)</h3>
            <p className="text-sm text-gray-300 leading-relaxed pl-4">
              カメラ内部で光を受け取る部品の大きさ。「フルサイズ」を基準とすることが多く、センサーが小さいと同じ焦点距離のレンズでも画像の一部を切り取ることになり、より望遠寄りの画角になります（クロップファクター）。
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-100 border-l-4 border-purple-500 pl-3">画角 (Angle of View)</h3>
            <p className="text-sm text-gray-300 leading-relaxed pl-4 mb-2">
              カメラが写し出せる範囲を角度（度）で表したもの。視野の広さを示します。
            </p>
            <ul className="text-sm text-gray-400 pl-6 space-y-1 list-disc list-inside">
              <li><span className="text-gray-200">水平画角:</span> 横方向に広がる視野</li>
              <li><span className="text-gray-200">垂直画角:</span> 縦方向に広がる視野</li>
              <li><span className="text-gray-200">対角画角:</span> 画面の対角線上の視野</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-100 border-l-4 border-amber-500 pl-3">アスペクト比 (Aspect Ratio)</h3>
            <p className="text-sm text-gray-300 leading-relaxed pl-4">
              画像の横と縦の長さの比率のこと。写真では3:2や4:3、映像では16:9やシネスコ（2.39:1などの横長サイズ）がよく使われます。
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-100 border-l-4 border-rose-500 pl-3">圧縮効果 (Compression Effect)</h3>
            <p className="text-sm text-gray-300 leading-relaxed pl-4">
              望遠レンズを使うと、遠くの背景が手前の被写体に引き寄せられたように大きく見え、遠近感と奥行き感が失われたように見える視覚効果のことです。背景のドラマチックな表現やポートレート撮影でよく利用されます。
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-100 border-l-4 border-orange-500 pl-3">F値・絞り (F-Number / Aperture)</h3>
            <p className="text-sm text-gray-300 leading-relaxed pl-4">
              レンズ内の光の通り道（絞り）の大きさを表す数値。F値が小さいほど絞りが開き（開放）、取り込む光が多く・背景のボケが大きくなります。F値が大きいほど絞りが閉じ（絞り込み）、光量は少なくなりますが、前後のピントが合う範囲が広がります。
            </p>
            <ul className="text-sm text-gray-400 pl-6 space-y-1 list-disc list-inside">
              <li><span className="text-gray-200">F1.4〜2.8:</span> 開放寄り。ボケが大きく、光量が多い</li>
              <li><span className="text-gray-200">F4〜8:</span> 標準的な絞り値</li>
              <li><span className="text-gray-200">F11〜22:</span> 絞り込み。深度が深く、光量が少ない</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="font-semibold text-gray-100 border-l-4 border-yellow-500 pl-3">被写界深度 (Depth of Field / DoF)</h3>
            <p className="text-sm text-gray-300 leading-relaxed pl-4 mb-2">
              ピントが合っているように見える「前後の距離範囲」のこと。焦点距離・F値・フォーカス距離・センサーサイズの組み合わせで変わります。
            </p>
            <ul className="text-sm text-gray-400 pl-6 space-y-1 list-disc list-inside">
              <li><span className="text-gray-200">近点:</span> ピントが合い始める手前の距離</li>
              <li><span className="text-gray-200">遠点:</span> ピントが合う最も遠い距離（∞は無限遠まで合焦）</li>
              <li><span className="text-gray-200">過焦点距離:</span> この距離にフォーカスを合わせると、近点から無限遠まで合焦する特殊な距離</li>
            </ul>
          </section>
        </div>
        
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-700"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
