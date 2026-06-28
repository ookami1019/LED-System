import React from 'react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-700/50 bg-gray-800/50">
          <h2 className="flex items-center gap-2 text-xl font-bold text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            用語説明
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-gray-100 border-l-4 border-blue-500 pl-3">シャッター速度 (Shutter Speed)</h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-4">
                カメラのセンサーが光を取り込む（露光する）時間。単位は秒（例：1/60秒など）。短いほどブレを抑えられますが、光量が少なくなります。
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-gray-100 border-l-4 border-emerald-500 pl-3">シャッター開角度 (Shutter Angle)</h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-4">
                映画用カメラなどで使われる露光時間の表現方法。ロータリーシャッターの開いている角度（度数）で示します。180度が標準的で、「360度 × (フレームレート × 露光時間)」で計算できます。
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-gray-100 border-l-4 border-purple-500 pl-3">リフレッシュレート (Refresh Rate)</h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-4">
                LEDウォールやディスプレイが1秒間に画面を更新する回数（Hz）。これが高いほど映像が滑らかになり、カメラとの同期ズレが起きにくくなります。
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-gray-100 border-l-4 border-amber-500 pl-3">スキャンレート / マルチプレクス (Scan Rate / Mux)</h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-4">
                LEDパネルの駆動方式。1回の更新タイミングで全ピクセルを同時に光らせるのではなく、数行ずつ順番に光らせます。「1/16 Scan」の場合、1回の点灯で全体の1/16の行だけが光ることを意味します。
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-gray-100 border-l-4 border-rose-500 pl-3">スキャンライン現象 / フリッカー (Scanlines / Flicker)</h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-4">
                LEDのスキャン駆動とカメラのシャッター速度が合わないことによって、画面上に黒い横縞模様が映り込んだり、チカチカと明滅して見える現象です。これを防ぐためにシャッター同期（ShutterSync）が重要になります。
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-gray-100 border-l-4 border-yellow-500 pl-3">ジェンロック (Genlock)</h3>
              <p className="text-sm text-gray-400 leading-relaxed pl-4">
                カメラの露光開始タイミングとLEDウォールの描画開始タイミングを完全に一致させるための同期信号。これにより、位相ズレによる予測不可能なフリッカーを防止します。
              </p>
            </section>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/80 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium rounded-lg border border-gray-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
