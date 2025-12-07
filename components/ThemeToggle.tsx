'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslations } from 'next-intl';

export default function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  const t = useTranslations();

  return (
    <Tooltip title={mode === 'light' ? t('darkMode') : t('lightMode')}>
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}
