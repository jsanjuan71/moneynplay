'use client';

import { Box, Container, Grid, Typography, Card, CardContent, Stack, Fab, Button, Paper } from '@mui/material';
import { Add, School, Store, People, ShoppingBag } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import WalletOverview from '@/components/kid/WalletOverview';
import MissionsBoard from '@/components/kid/MissionsBoard';
import AvatarDisplay from '@/components/kid/AvatarDisplay';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

// For demo purposes - Replace this with your actual child ID from seed data
// To get the ID: Run the seed:seedDemoData mutation in Convex dashboard
const DEMO_USER_ID = "m173sgvkmskzss8x6k4dgr4pqn7wt3qm" as Id<"users">;

export default function KidDashboard() {
  const t = useTranslations('kid.dashboard');
  const tWallet = useTranslations('kid.wallet');
  const tNav = useTranslations('kid.navigation');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  // Show setup instructions if no user ID configured
  if (!DEMO_USER_ID) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontSize: '80px', mb: 2 }}>
            🎮
          </Typography>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Kid Dashboard Setup
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            To view the kid dashboard, you need to seed demo data first.
          </Typography>
          
          <Box sx={{ bgcolor: 'background.default', p: 3, borderRadius: 2, my: 3, textAlign: 'left' }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Setup Steps:
            </Typography>
            <Typography variant="body2" component="div">
              <ol>
                <li>Make sure Convex dev server is running: <code>npx convex dev</code></li>
                <li>Open Convex Dashboard: <a href="https://dashboard.convex.dev" target="_blank" rel="noopener">dashboard.convex.dev</a></li>
                <li>Go to your project → Functions tab</li>
                <li>Find and run <code>seed:seedDemoData</code> mutation (no arguments needed)</li>
                <li>Copy the <code>childId</code> from the response</li>
                <li>Update <code>DEMO_USER_ID</code> in <code>app/[locale]/child/page.tsx</code></li>
                <li>Refresh this page</li>
              </ol>
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => window.open('https://dashboard.convex.dev', '_blank')}
            sx={{ mt: 2 }}
          >
            Open Convex Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  // Fetch dashboard data
  const dashboardData = useQuery(api.dashboard.getKidDashboard, {
    userId: DEMO_USER_ID,
  });

  if (!dashboardData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <Typography variant="h5">Loading your dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  const { user, wallet, activeMissions, avatar } = dashboardData;

  const quickActions = [
    {
      title: tNav('missions'),
      icon: <School sx={{ fontSize: 40 }} />,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      path: '/child/missions',
    },
    {
      title: tNav('shop'),
      icon: <Store sx={{ fontSize: 40 }} />,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      path: '/child/shop',
    },
    {
      title: tNav('marketplace'),
      icon: <ShoppingBag sx={{ fontSize: 40 }} />,
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      path: '/child/marketplace',
    },
    {
      title: tNav('friends'),
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#10B981',
      bgColor: '#D1FAE5',
      path: '/child/friends',
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {t('greeting', { name: user.name })}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {t('mascotWelcome')}
              </Typography>
            </Box>
            <Typography variant="h1" sx={{ fontSize: '80px' }}>
              💰
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Left Column - Wallet & Avatar */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Avatar Card */}
              {avatar && (
                <AvatarDisplay
                  name={user.name}
                  skinTone={avatar.skinTone}
                  hairStyle={avatar.hairStyle}
                  hairColor={avatar.hairColor}
                  outfit={avatar.outfit}
                  accessories={avatar.accessories}
                />
              )}

              {/* Wallet Overview */}
              <WalletOverview
                realMoney={wallet.realMoneyBalance}
                virtualCoins={wallet.virtualCoinsBalance}
                savings={wallet.savingsBalance}
                investments={wallet.investmentBalance}
              />
            </Stack>
          </Grid>

          {/* Right Column - Missions & Quick Actions */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Missions Board */}
              <MissionsBoard activeMissions={activeMissions} locale={locale} />

              {/* Quick Actions */}
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={6} sm={6} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                        }}
                        onClick={() => router.push(action.path)}
                      >
                        <CardContent>
                          <Stack spacing={1} alignItems="center">
                            <Box
                              sx={{
                                bgcolor: action.bgColor,
                                color: action.color,
                                borderRadius: 2,
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {action.icon}
                            </Box>
                            <Typography variant="body1" fontWeight="bold" textAlign="center">
                              {action.title}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Recent Activity */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    Recent Activity 📋
                  </Typography>
                  {dashboardData.recentTransactions.length === 0 ? (
                    <Box textAlign="center" py={3}>
                      <Typography variant="body2" color="text.secondary">
                        No recent activity yet!
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {dashboardData.recentTransactions.slice(0, 3).map((transaction) => (
                        <Box
                          key={transaction._id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {transaction.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color={transaction.type === 'deposit' ? 'success.main' : 'text.primary'}
                          >
                            {transaction.currency === 'real'
                              ? `$${(transaction.amount / 100).toFixed(2)}`
                              : `${transaction.amount} 🪙`}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => router.push('/child/missions')}
      >
        <Add />
      </Fab>
    </Box>
  );
}
