import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameEngine } from './hooks/useGameEngine';
import styles from './styles/Game.module.scss';

// Назви апгрейдів для інтерфейсу
const UPGRADE_NAMES = {
  vintageMic: "Ретро-мікрофон (Клік)",
  fenderGuitar: "Вінтажна гітара (Пасив)",
  bloodBank: "Банк крові (Пасив)",
  nightStudio: "Нічна студія (Пасив)",
  eternalMuse: "Вічне натхнення (Клік)"
};

function App() {
  // Отримуємо стан і дії гри з хука
  const { 
    gameState, handleCustomClick, buyUpgrade, doPrestige, 
    eventMsg, unlockSkin, changeSkin, offlineEarnings, closeOfflineModal
  } = useGameEngine();

  // Вибираємо тему та множники для відображення
  const themeClass = gameState.activeSkin === 'tangier-sun' ? styles.tangierSun : styles.detroitNight;
  const prestigeGain = Math.floor(Math.sqrt(gameState.credits / 10000));
  const multiplier = (1 + gameState.duiktcoins * 0.1).toFixed(1);

  // Основний UI гри
  return (
    <div className={`${styles.gameContainer} ${themeClass}`}>
      <AnimatePresence>
        {eventMsg && (
          <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} className={styles.eventToast}>
            {eventMsg}
          </motion.div>
        )}
        {offlineEarnings > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={styles.modal}>
            <h2>Ти повернувся!</h2>
            <p>Поки тебе не було, ти заробив <strong>{Math.floor(offlineEarnings)}</strong> кредитів.</p>
            <button onClick={closeOfflineModal} style={{marginTop: '1rem', padding: '0.5rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '4px'}}>Забрати</button>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={styles.header}>
        <h1>Nocturnal Clicker</h1>
        <div className={styles.credits}>Кредити: {Math.floor(gameState.credits)}</div>
        <div>Множник доходу: x{multiplier} ({gameState.duiktcoins} Duiktcoins)</div>
        <div>Пасивний дохід: {Math.floor(gameState.passiveIncome * multiplier)} / сек</div>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.clickArea}>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className={styles.clickButton} 
            onClick={handleCustomClick}
          >
            КЛІК<br/>(+{(gameState.clickValue * multiplier).toFixed(1)})
          </motion.button>
        </div>

        <div className={styles.upgradesPanel}>
          <h2>Апгрейди</h2>
          {Object.entries(gameState.upgrades).map(([key, upg]) => {
            const cost = Math.floor(upg.baseCost * Math.pow(upg.costMult, upg.level));
            return (
              <div key={key} className={styles.upgradeItem}>
                <div>
                  <strong>{UPGRADE_NAMES[key]}</strong> (Рівень {upg.level})<br/>
                  <small>Ефект: +{upg.effect} {upg.type === 'click' ? 'до кліку' : 'до пасиву'}</small>
                </div>
                <button disabled={gameState.credits < cost} onClick={() => buyUpgrade(key)}>
                  Купити ({cost})
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.mainGrid} style={{ marginTop: '2rem' }}>
        <div className={styles.prestigePanel}>
          <h2>Престиж</h2>
          <p>Скинути весь прогрес заради Duiktcoins. Поточний обмін: {prestigeGain} монет.</p>
          <button 
            disabled={prestigeGain < 1} 
            onClick={doPrestige}
            style={{background: prestigeGain >= 1 ? 'var(--accent)' : 'gray', padding: '1rem', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
          >
            Виконати Престиж
          </button>
        </div>

        <div className={styles.prestigePanel}>
          <h2>Скіни</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={() => changeSkin('detroit-night')}
              style={{ padding: '0.5rem', background: gameState.activeSkin === 'detroit-night' ? 'var(--accent)' : '#333', color: 'white', border: 'none' }}
            >Detroit Night</button>
            
            {gameState.unlockedSkins.includes('tangier-sun') ? (
               <button 
                onClick={() => changeSkin('tangier-sun')}
                style={{ padding: '0.5rem', background: gameState.activeSkin === 'tangier-sun' ? 'var(--accent)' : '#333', color: 'white', border: 'none' }}
              >Tangier Sun</button>
            ) : (
              <button 
                onClick={() => unlockSkin('tangier-sun', 5)}
                style={{ padding: '0.5rem', background: 'gray', color: 'white', border: 'none' }}
              >Відкрити Tangier (5 Duiktcoins)</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;