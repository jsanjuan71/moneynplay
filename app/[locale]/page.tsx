'use client';

import { useTranslations } from 'next-intl';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Container,
  AppBar,
  Toolbar,
  Stack,
  Button
} from '@mui/material';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useRouter } from '@/i18n/routing';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Money n Play
          </Typography>
          <ThemeToggle />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            <WelcomeMessage />
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            <DescriptionMessage />
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              onClick={() => router.push('/child')}
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              🎮 Kid Dashboard Demo
            </Button>
            <Button
              onClick={() => router.push('/parent')}
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              👨‍👩‍👧 Parent Dashboard
            </Button>
          </Stack>
        </Box>

        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                <FeaturesTitle />
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <FeaturesList />
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

function WelcomeMessage() {
  const t = useTranslations();
  return <>{t('welcome')}</>;
}

function DescriptionMessage() {
  const t = useTranslations();
  return <>{t('description')}</>;
}

function FeaturesTitle() {
  const t = useTranslations('features');
  return <>{t('title')}</>;
}

function FeaturesList() {
  const t = useTranslations('features');
  return (
    <>
      <Typography component="li">{t('typescript')}</Typography>
      <Typography component="li">{t('tailwind')}</Typography>
      <Typography component="li">{t('materialui')}</Typography>
      <Typography component="li">{t('darkmode')}</Typography>
      <Typography component="li">{t('i18n')}</Typography>
      <Typography component="li">{t('convex')}</Typography>
    </>
  );
}
