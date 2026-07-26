import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ClockIcon from './icons/Clock';
import RefreshIcon from './icons/RefreshIcon';

interface CountdownTimerProps {
  expiryTimestamp: number;
  onReset: () => void;
}

const formatTimeUnit = (unit: number): string => {
  return unit < 10 ? `0${unit}` : `${unit}`;
};

export function CountdownTimer({ expiryTimestamp, onReset }: CountdownTimerProps) {
  const { t } = useTranslation();

  const calculateTimeLeft = useCallback(() => {
    const difference = expiryTimestamp - Date.now();
    let timeLeft = {
      hours: '00',
      minutes: '00',
      seconds: '00',
      expired: difference <= 0,
    };

    if (difference > 0) {
      const totalSeconds = Math.floor(difference / 1000);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const hours = Math.floor(totalMinutes / 60);

      timeLeft = {
        hours: formatTimeUnit(hours),
        minutes: formatTimeUnit(minutes),
        seconds: formatTimeUnit(seconds),
        expired: false,
      };
    }

    return timeLeft;
  }, [expiryTimestamp]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTimestamp, calculateTimeLeft]);

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400 font-medium">
            {t('Expires in')}
          </span>
        </div>
        {!timeLeft.expired && (
          <button
            onClick={onReset}
            className="p-1.5 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            title={t('Reset validity')}>
            <RefreshIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {timeLeft.expired ? (
        <div className="mt-2 text-center py-2">
          <span className="text-red-400 text-sm font-medium">{t('Email expired')}</span>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-center gap-1">
          <div className="flex flex-col items-center">
            <div className="w-12 h-10 rounded-md bg-slate-900/80 border border-slate-700/50 flex items-center justify-center">
              <span className="text-lg font-bold font-mono text-cyan-400">{timeLeft.hours}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1">时</span>
          </div>
          <span className="text-slate-500 font-bold -mt-4">:</span>
          <div className="flex flex-col items-center">
            <div className="w-12 h-10 rounded-md bg-slate-900/80 border border-slate-700/50 flex items-center justify-center">
              <span className="text-lg font-bold font-mono text-cyan-400">{timeLeft.minutes}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1">分</span>
          </div>
          <span className="text-slate-500 font-bold -mt-4">:</span>
          <div className="flex flex-col items-center">
            <div className="w-12 h-10 rounded-md bg-slate-900/80 border border-slate-700/50 flex items-center justify-center">
              <span className="text-lg font-bold font-mono text-cyan-400">{timeLeft.seconds}</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1">秒</span>
          </div>
        </div>
      )}
    </div>
  );
}
