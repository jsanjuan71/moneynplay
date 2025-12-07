'use client';

import { Card, CardContent, Typography, Box, Stack, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

interface AvatarDisplayProps {
  name: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfit: string;
  accessories: string[];
}

export default function AvatarDisplay({
  name,
  skinTone,
  hairStyle,
  hairColor,
  outfit,
  accessories,
}: AvatarDisplayProps) {
  const t = useTranslations('kid.avatar');
  const router = useRouter();

  // This is a placeholder - you'll want to implement actual avatar rendering
  const getAvatarEmoji = () => {
    // Simple emoji representation based on outfit
    const outfitEmojis: { [key: string]: string } = {
      default: '👤',
      casual: '🧑',
      formal: '👔',
      sports: '⚽',
      superhero: '🦸',
    };
    return outfitEmojis[outfit] || '👤';
  };

  const handleCustomize = () => {
    router.push('/child/avatar');
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
        },
      }}
      onClick={handleCustomize}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" fontWeight="bold">
            {t('title')}
          </Typography>
          <IconButton
            size="small"
            sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
            onClick={(e) => {
              e.stopPropagation();
              handleCustomize();
            }}
          >
            <Edit />
          </IconButton>
        </Stack>

        <Box textAlign="center" my={2}>
          <Typography variant="h1" sx={{ fontSize: '100px' }}>
            {getAvatarEmoji()}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {name}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
            }}
          >
            <Typography variant="caption">{outfit}</Typography>
          </Box>
          {accessories.slice(0, 2).map((accessory, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography variant="caption">{accessory}</Typography>
            </Box>
          ))}
          {accessories.length > 2 && (
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography variant="caption">+{accessories.length - 2}</Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
