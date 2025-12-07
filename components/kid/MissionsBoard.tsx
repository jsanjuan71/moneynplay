'use client';

import { Card, CardContent, Typography, Box, Stack, LinearProgress, Button, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { LocalizedString } from '@/types';

interface Mission {
  _id: string;
  title: LocalizedString;
  description: LocalizedString;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardCoins: number;
}

interface UserMission {
  _id: string;
  missionId: string;
  status: 'active' | 'completed' | 'failed' | 'expired';
  progress: number;
  startedAt: number;
  completedAt?: number;
  rewardClaimed: boolean;
}

interface MissionWithDetails {
  userMission: UserMission;
  mission: Mission | null;
}

interface MissionsBoardProps {
  activeMissions: MissionWithDetails[];
  locale: string;
}

export default function MissionsBoard({ activeMissions, locale }: MissionsBoardProps) {
  const t = useTranslations('kid.missions');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMissionEmoji = (type: string) => {
    switch (type) {
      case 'save_money':
        return '💰';
      case 'learn_video':
        return '📺';
      case 'make_decision':
        return '🤔';
      case 'predict_investment':
        return '📈';
      case 'complete_task':
        return '✅';
      case 'streak':
        return '🔥';
      case 'quiz':
        return '🧠';
      default:
        return '🎯';
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          {t('title')}
        </Typography>
        {activeMissions.length > 0 && (
          <Chip
            label={`${activeMissions.length} ${t('active')}`}
            color="primary"
            size="small"
          />
        )}
      </Stack>

      {activeMissions.length === 0 ? (
        <Card sx={{ bgcolor: '#F3F4F6' }}>
          <CardContent>
            <Box textAlign="center" py={3}>
              <Typography variant="h3" mb={1}>
                🎯
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('noActive')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {activeMissions.map(({ userMission, mission }) => {
            if (!mission) return null;

            const title = mission.title[locale as keyof LocalizedString] || mission.title.en;
            const description = mission.description[locale as keyof LocalizedString] || mission.description.en;

            return (
              <Card
                key={userMission._id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                        <Typography variant="h4">
                          {getMissionEmoji(mission.type)}
                        </Typography>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold">
                            {title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {description}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip
                        label={mission.difficulty}
                        color={getDifficultyColor(mission.difficulty)}
                        size="small"
                      />
                    </Stack>

                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {t('progress')}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {userMission.progress}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={userMission.progress}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {t('reward')}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            {mission.rewardCoins}
                          </Typography>
                          <Typography variant="body2">🪙</Typography>
                        </Stack>
                      </Box>
                      <Button
                        variant="contained"
                        disabled={userMission.progress < 100 || userMission.rewardClaimed}
                      >
                        {userMission.progress >= 100 && !userMission.rewardClaimed
                          ? t('claimReward')
                          : t('continueMission')}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
