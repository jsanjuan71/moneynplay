'use client';

import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { AccountBalance, Savings, TrendingUp, AccountBalanceWallet } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

interface WalletOverviewProps {
  realMoney: number; // in cents
  virtualCoins: number;
  savings: number; // in cents
  investments: number; // in cents
}

export default function WalletOverview({
  realMoney,
  virtualCoins,
  savings,
  investments,
}: WalletOverviewProps) {
  const t = useTranslations('kid.wallet');

  const formatMoney = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const totalReal = realMoney + savings + investments;

  const moneyZones = [
    {
      title: t('realMoney'),
      amount: formatMoney(realMoney),
      icon: <AccountBalanceWallet sx={{ fontSize: 40 }} />,
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    {
      title: t('virtualCoins'),
      amount: virtualCoins.toString(),
      subtitle: t('coins'),
      icon: <Box sx={{ fontSize: 40 }}>🪙</Box>,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
    },
    {
      title: t('savings'),
      amount: formatMoney(savings),
      icon: <Savings sx={{ fontSize: 40 }} />,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    {
      title: t('investments'),
      amount: formatMoney(investments),
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {t('title')}
      </Typography>
      
      {totalReal === 0 && (
        <Card sx={{ mb: 2, bgcolor: '#FEF3C7', border: '2px dashed #F59E0B' }}>
          <CardContent>
            <Typography variant="body1" color="text.secondary">
              {t('emptyWallet')}
            </Typography>
          </CardContent>
        </Card>
      )}

      <Stack spacing={2}>
        {moneyZones.map((zone, index) => (
          <Card
            key={index}
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
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    bgcolor: zone.bgColor,
                    color: zone.color,
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {zone.icon}
                </Box>
                <Box flex={1}>
                  <Typography variant="body2" color="text.secondary">
                    {zone.title}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {zone.amount}
                    {zone.subtitle && (
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {zone.subtitle}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {totalReal > 0 && (
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  {t('total')}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatMoney(totalReal)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
