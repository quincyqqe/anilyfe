'use client';

import { useState, useCallback } from 'react';
import { daysOfWeek } from '@/shared/constants';

function getTodayId(): string {
  const today = new Date().toLocaleString('ru-RU', { weekday: 'long' });
  const normalized = today.charAt(0).toUpperCase() + today.slice(1).toLowerCase();
  return daysOfWeek.find((d) => d.fullLabel === normalized)?.id ?? '';
}

export function useScheduleDay() {
  const [currentDay, setCurrentDay] = useState<string>(() => getTodayId());

  const setDay = useCallback((id: string) => setCurrentDay(id), []);

  return { currentDay, setDay };
}
