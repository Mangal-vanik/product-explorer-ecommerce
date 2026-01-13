'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '@/app/ThemeRegistry';

export default function ThemeToggle() {
  const { mode, toggleColorMode } = useThemeMode();

  return (
    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          ml: 1,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}