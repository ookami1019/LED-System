import React from 'react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
            用語説明
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="modal-body custom-scrollbar">
          <section className="glossary-section">
            <h3 className="glossary-term term-blue">シャッター速度 (Shutter Speed)</h3>
            <p className="glossary-desc">
              カメラのセンサーが光を取り込む（露光する）時間。単位は秒（例：1/60秒など）。短いほどブレを抑えられますが、光量が少なくなります。
            </p>
          </section>

          <section className="glossary-section">
            <h3 className="glossary-term term-emerald">シャッター開角度 (Shutter Angle)</h3>
            <p className="glossary-desc">
              映画用カメラなどで使われる露光時間の表現方法。ロータリーシャッターの開いている角度（度数）で示します。180度が標準的で、「360度 × (フレームレート × 露光時間)」で計算できます。
            </p>
          </section>

          <section className="glossary-section">
            <h3 className="glossary-term term-purple">リフレッシュレート (Refresh Rate)</h3>
            <p className="glossary-desc">
              LEDウォールやディスプレイが1秒間に画面を更新する回数（Hz）。これが高いほど映像が滑らかになり、カメラとの同期ズレが起きにくくなります。
            </p>
          </section>

          <section className="glossary-section">
            <h3 className="glossary-term term-amber">スキャンレート / マルチプレクス (Scan Rate / Mux)</h3>
            <p className="glossary-desc">
              LEDパネルの駆動方式。1回の更新タイミングで全ピクセルを同時に光らせるのではなく、数行ずつ順番に光らせます。「1/16 Scan」の場合、1回の点灯で全体の1/16の行だけが光ることを意味します。
            </p>
          </section>

          <section className="glossary-section">
            <h3 className="glossary-term term-rose">スキャンライン現象 / フリッカー (Scanlines / Flicker)</h3>
            <p className="glossary-desc">
              LEDのスキャン駆動とカメラのシャッター速度が合わないことによって、画面上に黒い横縞模様が映り込んだり、チカチカと明滅して見える現象です。これを防ぐためにシャッター同期（ShutterSync）が重要になります。
            </p>
          </section>

          <section className="glossary-section">
            <h3 className="glossary-term term-yellow">ジェンロック (Genlock)</h3>
            <p className="glossary-desc">
              カメラの露光開始タイミングとLEDウォールの描画開始タイミングを完全に一致させるための同期信号。これにより、位相ズレによる予測不可能なフリッカーを防止します。
            </p>
          </section>
        </div>
        
        <div className="modal-footer">
          <button className="modal-action-btn" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
