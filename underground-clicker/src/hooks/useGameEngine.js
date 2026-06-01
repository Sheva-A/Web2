import { useState, useEffect, useCallback } from 'react';
import { saveGame, loadGame } from '../utils/db';

// Початковий стан гри
const INITIAL_STATE = {
  credits: 0,
  duiktcoins: 0,
  clickValue: 1,
  passiveIncome: 0,
  lastPlayed: Date.now(),
  activeSkin: 'detroit-night',
  unlockedSkins: ['detroit-night'],
  upgrades: {
    vintageMic: { level: 0, baseCost: 15, costMult: 1.15, effect: 1, type: 'click' },
    fenderGuitar: { level: 0, baseCost: 100, costMult: 1.15, effect: 5, type: 'passive' },
    bloodBank: { level: 0, baseCost: 500, costMult: 1.2, effect: 25, type: 'passive' },
    nightStudio: { level: 0, baseCost: 2000, costMult: 1.2, effect: 100, type: 'passive' },
    eternalMuse: { level: 0, baseCost: 10000, costMult: 1.5, effect: 10, type: 'click' },
  }
};

export const useGameEngine = () => {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [eventMsg, setEventMsg] = useState(null);
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState(0);

  // Завантажує збереження і нараховує офлайн-доходи
  useEffect(() => {
    loadGame().then(savedState => {
      if (savedState) {
        const now = Date.now();
        const offlineTimeSec = Math.floor((now - savedState.lastPlayed) / 1000);
        
        if (offlineTimeSec > 60 && savedState.passiveIncome > 0) {
          const earned = offlineTimeSec * savedState.passiveIncome;
          setOfflineEarnings(earned);
          savedState.credits += earned;
        }
        setGameState({ ...savedState, lastPlayed: now });
      }
    });
  }, []);

  // Зберігає гру кожні 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newState = { ...prev, lastPlayed: Date.now() };
        saveGame(newState);
        return newState;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Нараховує пасивний дохід кожні 0.1 секунди
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const multiplier = 1 + (prev.duiktcoins * 0.1); 
        return { ...prev, credits: prev.credits + (prev.passiveIncome * multiplier) / 10 };
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Випадкові ігрові події з бонусами або блокуванням кліків
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.15) { 
        const isBad = Math.random() > 0.5;
        if (isBad) {
          setEventMsg("🎸 Порвалась струна! Кліки заблоковано на 5 сек.");
          setIsClickBlocked(true);
          setTimeout(() => { setIsClickBlocked(false); setEventMsg(null); }, 5000);
        } else {
          const bonus = gameState.passiveIncome * 60 + 100; // Хвилина пасивного доходу
          setEventMsg(`🦇 Сплеск натхнення! Знайдено ${bonus.toFixed(0)} кредитів!`);
          setGameState(prev => ({ ...prev, credits: prev.credits + bonus }));
          setTimeout(() => setEventMsg(null), 4000);
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [gameState.passiveIncome]);

  // Обробка кліку гравця
  const handleCustomClick = useCallback(() => {
    if (isClickBlocked) return;
    setGameState(prev => {
      const multiplier = 1 + (prev.duiktcoins * 0.1);
      return { ...prev, credits: prev.credits + (prev.clickValue * multiplier) };
    });
  }, [isClickBlocked]);

  // Купівля апгрейду, оновлення ресурсів
  const buyUpgrade = (key) => {
    setGameState(prev => {
      const upgrade = prev.upgrades[key];
      const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMult, upgrade.level));
      
      if (prev.credits >= cost) {
        const newUpgrades = {
          ...prev.upgrades,
          [key]: { ...upgrade, level: upgrade.level + 1 }
        };
        
        return {
          ...prev,
          credits: prev.credits - cost,
          upgrades: newUpgrades,
          clickValue: upgrade.type === 'click' ? prev.clickValue + upgrade.effect : prev.clickValue,
          passiveIncome: upgrade.type === 'passive' ? prev.passiveIncome + upgrade.effect : prev.passiveIncome
        };
      }
      return prev;
    });
  };

  // Престиж: скидає прогрес, дає Duiktcoins
  const doPrestige = () => {
    setGameState(prev => {
      const gainedCoins = Math.floor(Math.sqrt(prev.credits / 10000));
      if (gainedCoins < 1) return prev;
      
      return {
        ...INITIAL_STATE,
        duiktcoins: prev.duiktcoins + gainedCoins,
        unlockedSkins: prev.unlockedSkins,
        activeSkin: prev.activeSkin
      };
    });
  };

  // Відкриття нового скіна
  const unlockSkin = (skinId, cost) => {
    setGameState(prev => {
      if (prev.duiktcoins >= cost && !prev.unlockedSkins.includes(skinId)) {
        return {
          ...prev,
          duiktcoins: prev.duiktcoins - cost,
          unlockedSkins: [...prev.unlockedSkins, skinId]
        };
      }
      return prev;
    });
  };

  // Зміна активного скіна
  const changeSkin = (skinId) => {
    setGameState(prev => ({ ...prev, activeSkin: skinId }));
  };

  // Закриває повідомлення про офлайн доходи
  const closeOfflineModal = () => setOfflineEarnings(0);

  return {
    gameState, handleCustomClick, buyUpgrade, doPrestige, eventMsg,
    unlockSkin, changeSkin, offlineEarnings, closeOfflineModal
  };
};