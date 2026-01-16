/**
 * NotificationPreferences Component Template
 *
 * A settings page component for managing notification preferences.
 * Uses card-based UI for category toggles as per design guidelines.
 *
 * Copy this file to your project and customize:
 * 1. Update import paths
 * 2. Connect to your notification store
 * 3. Customize categories if needed
 *
 * @example
 * // Copy to: src/components/notifications/NotificationPreferences.tsx
 *
 * @author Ahsan Mahmood <aoneahsan@gmail.com>
 */

import { useCallback } from 'react';
import { Box, Flex, Text, Heading, Switch, Card, Separator } from '@radix-ui/themes';
import {
  Bell,
  Shield,
  Activity,
  FileText,
  Sparkles,
  Users,
  Moon,
  Mail,
  Smartphone,
} from 'lucide-react';
import type {
  NotificationPreferences,
  NotificationPreferencesProps,
  NotificationCategory,
  CategoryPreference,
  CATEGORY_NAMES,
  CATEGORY_DESCRIPTIONS,
} from 'shared-features';

// ============================================================================
// CATEGORY ICONS
// ============================================================================

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  system: Bell,
  account: Shield,
  activity: Activity,
  report: FileText,
  promotional: Sparkles,
  social: Users,
};

// ============================================================================
// CATEGORY CARD COMPONENT
// ============================================================================

interface CategoryCardProps {
  category: NotificationCategory;
  preference: CategoryPreference;
  onPreferenceChange: (preference: CategoryPreference) => void;
  showPush?: boolean;
  showEmail?: boolean;
}

function CategoryCard({
  category,
  preference,
  onPreferenceChange,
  showPush = true,
  showEmail = false,
}: CategoryCardProps) {
  const Icon = CATEGORY_ICONS[category];

  // Category names and descriptions - you can import these from shared-features
  const names: Record<NotificationCategory, string> = {
    system: 'System',
    account: 'Account',
    activity: 'Activity',
    report: 'Reports',
    promotional: 'Tips & Updates',
    social: 'Social',
  };

  const descriptions: Record<NotificationCategory, string> = {
    system: 'Maintenance updates, outages, and system alerts',
    account: 'Welcome messages, security alerts, and profile changes',
    activity: 'Updates about your actions and changes',
    report: 'Weekly and monthly summaries of your activity',
    promotional: 'Tips, new features, and holiday greetings',
    social: 'Mentions, shares, and comments from others',
  };

  return (
    <Card style={{ padding: 'var(--space-4)' }}>
      <Flex gap="3">
        {/* Icon */}
        <Box
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-2)',
            background: 'var(--accent-a3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={22} color="var(--accent-9)" />
        </Box>

        {/* Content */}
        <Flex direction="column" gap="2" style={{ flex: 1 }}>
          <Box>
            <Text size="3" weight="medium">
              {names[category]}
            </Text>
            <Text size="2" color="gray" style={{ display: 'block' }}>
              {descriptions[category]}
            </Text>
          </Box>

          {/* Toggles */}
          <Flex gap="4" mt="2">
            {/* In-App Toggle */}
            <Flex align="center" gap="2">
              <Switch
                checked={preference.inApp}
                onCheckedChange={(checked) =>
                  onPreferenceChange({ ...preference, inApp: checked })
                }
              />
              <Text size="2" color="gray">
                In-App
              </Text>
            </Flex>

            {/* Push Toggle */}
            {showPush && (
              <Flex align="center" gap="2">
                <Switch
                  checked={preference.push}
                  onCheckedChange={(checked) =>
                    onPreferenceChange({ ...preference, push: checked })
                  }
                />
                <Text size="2" color="gray">
                  Push
                </Text>
              </Flex>
            )}

            {/* Email Toggle */}
            {showEmail && (
              <Flex align="center" gap="2">
                <Switch
                  checked={preference.email}
                  onCheckedChange={(checked) =>
                    onPreferenceChange({ ...preference, email: checked })
                  }
                />
                <Text size="2" color="gray">
                  Email
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * NotificationPreferences - Settings page for notification preferences
 *
 * @example
 * ```tsx
 * const { preferences, updatePreferences } = useNotificationsStore();
 *
 * return (
 *   <NotificationPreferences
 *     preferences={preferences}
 *     onPreferencesChange={updatePreferences}
 *     showPushSettings={true}
 *     showEmailSettings={false}
 *   />
 * );
 * ```
 */
export function NotificationPreferences({
  preferences,
  onPreferencesChange,
  isSaving = false,
  visibleCategories,
  showPushSettings = true,
  showEmailSettings = false,
  showQuietHours = false,
}: NotificationPreferencesProps) {
  // Determine which categories to show
  const categories: NotificationCategory[] = visibleCategories || [
    'system',
    'account',
    'activity',
    'report',
    'promotional',
    'social',
  ];

  // Handle category preference change
  const handleCategoryChange = useCallback(
    (category: NotificationCategory, newPreference: CategoryPreference) => {
      onPreferencesChange({
        ...preferences,
        categories: {
          ...preferences.categories,
          [category]: newPreference,
        },
      });
    },
    [preferences, onPreferencesChange]
  );

  // Enable all notifications
  const enableAll = useCallback(() => {
    const updatedCategories = { ...preferences.categories };
    categories.forEach((cat) => {
      updatedCategories[cat] = { inApp: true, push: true, email: true };
    });
    onPreferencesChange({
      ...preferences,
      categories: updatedCategories,
    });
  }, [preferences, categories, onPreferencesChange]);

  // Disable all notifications (except system)
  const disableAll = useCallback(() => {
    const updatedCategories = { ...preferences.categories };
    categories.forEach((cat) => {
      // Keep system notifications enabled for important alerts
      if (cat === 'system') {
        updatedCategories[cat] = { inApp: true, push: true, email: false };
      } else {
        updatedCategories[cat] = { inApp: false, push: false, email: false };
      }
    });
    onPreferencesChange({
      ...preferences,
      categories: updatedCategories,
    });
  }, [preferences, categories, onPreferencesChange]);

  return (
    <Box>
      {/* Header */}
      <Flex justify="between" align="center" mb="4">
        <Box>
          <Heading size="4">Notification Preferences</Heading>
          <Text size="2" color="gray">
            Choose what notifications you want to receive
          </Text>
        </Box>

        {/* Quick Actions */}
        <Flex gap="2">
          <Text
            size="2"
            style={{
              color: 'var(--accent-9)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={enableAll}
          >
            Enable All
          </Text>
          <Text size="2" color="gray">
            |
          </Text>
          <Text
            size="2"
            style={{
              color: 'var(--gray-9)',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={disableAll}
          >
            Disable All
          </Text>
        </Flex>
      </Flex>

      {/* Category Cards */}
      <Flex direction="column" gap="3">
        {categories.map((category) => (
          <CategoryCard
            key={category}
            category={category}
            preference={preferences.categories[category]}
            onPreferenceChange={(pref) => handleCategoryChange(category, pref)}
            showPush={showPushSettings}
            showEmail={showEmailSettings}
          />
        ))}
      </Flex>

      {/* Push Notification Settings */}
      {showPushSettings && (
        <>
          <Separator size="4" my="5" />

          <Box>
            <Flex align="center" gap="2" mb="3">
              <Smartphone size={20} color="var(--gray-9)" />
              <Heading size="3">Push Notifications</Heading>
            </Flex>

            <Card style={{ padding: 'var(--space-4)' }}>
              <Flex justify="between" align="center">
                <Box>
                  <Text size="2" weight="medium">
                    Enable Push Notifications
                  </Text>
                  <Text size="2" color="gray" style={{ display: 'block' }}>
                    Receive notifications even when the app is closed
                  </Text>
                </Box>
                <Switch
                  checked={preferences.push.enabled}
                  onCheckedChange={(checked) =>
                    onPreferencesChange({
                      ...preferences,
                      push: { ...preferences.push, enabled: checked },
                    })
                  }
                />
              </Flex>
            </Card>
          </Box>
        </>
      )}

      {/* Quiet Hours */}
      {showQuietHours && (
        <>
          <Separator size="4" my="5" />

          <Box>
            <Flex align="center" gap="2" mb="3">
              <Moon size={20} color="var(--gray-9)" />
              <Heading size="3">Quiet Hours</Heading>
            </Flex>

            <Card style={{ padding: 'var(--space-4)' }}>
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Box>
                    <Text size="2" weight="medium">
                      Enable Quiet Hours
                    </Text>
                    <Text size="2" color="gray" style={{ display: 'block' }}>
                      Pause notifications during specific hours
                    </Text>
                  </Box>
                  <Switch
                    checked={preferences.quietHours.enabled}
                    onCheckedChange={(checked) =>
                      onPreferencesChange({
                        ...preferences,
                        quietHours: { ...preferences.quietHours, enabled: checked },
                      })
                    }
                  />
                </Flex>

                {preferences.quietHours.enabled && (
                  <Flex gap="4" align="center">
                    <Flex direction="column" gap="1">
                      <Text size="1" color="gray">
                        Start
                      </Text>
                      <input
                        type="time"
                        value={preferences.quietHours.start}
                        onChange={(e) =>
                          onPreferencesChange({
                            ...preferences,
                            quietHours: { ...preferences.quietHours, start: e.target.value },
                          })
                        }
                        style={{
                          padding: 'var(--space-2)',
                          borderRadius: 'var(--radius-2)',
                          border: '1px solid var(--gray-6)',
                          background: 'var(--color-background)',
                        }}
                      />
                    </Flex>
                    <Text size="2" color="gray" style={{ paddingTop: 20 }}>
                      to
                    </Text>
                    <Flex direction="column" gap="1">
                      <Text size="1" color="gray">
                        End
                      </Text>
                      <input
                        type="time"
                        value={preferences.quietHours.end}
                        onChange={(e) =>
                          onPreferencesChange({
                            ...preferences,
                            quietHours: { ...preferences.quietHours, end: e.target.value },
                          })
                        }
                        style={{
                          padding: 'var(--space-2)',
                          borderRadius: 'var(--radius-2)',
                          border: '1px solid var(--gray-6)',
                          background: 'var(--color-background)',
                        }}
                      />
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Card>
          </Box>
        </>
      )}

      {/* Email Digest */}
      {showEmailSettings && (
        <>
          <Separator size="4" my="5" />

          <Box>
            <Flex align="center" gap="2" mb="3">
              <Mail size={20} color="var(--gray-9)" />
              <Heading size="3">Email Digest</Heading>
            </Flex>

            <Card style={{ padding: 'var(--space-4)' }}>
              <Flex direction="column" gap="4">
                <Flex justify="between" align="center">
                  <Box>
                    <Text size="2" weight="medium">
                      Enable Email Digest
                    </Text>
                    <Text size="2" color="gray" style={{ display: 'block' }}>
                      Receive a summary of notifications via email
                    </Text>
                  </Box>
                  <Switch
                    checked={preferences.emailDigest.enabled}
                    onCheckedChange={(checked) =>
                      onPreferencesChange({
                        ...preferences,
                        emailDigest: { ...preferences.emailDigest, enabled: checked },
                      })
                    }
                  />
                </Flex>

                {preferences.emailDigest.enabled && (
                  <Flex gap="2">
                    {(['daily', 'weekly'] as const).map((freq) => (
                      <Card
                        key={freq}
                        onClick={() =>
                          onPreferencesChange({
                            ...preferences,
                            emailDigest: { ...preferences.emailDigest, frequency: freq },
                          })
                        }
                        style={{
                          padding: 'var(--space-3)',
                          cursor: 'pointer',
                          border:
                            preferences.emailDigest.frequency === freq
                              ? '2px solid var(--accent-9)'
                              : '1px solid var(--gray-6)',
                        }}
                      >
                        <Text
                          size="2"
                          weight={
                            preferences.emailDigest.frequency === freq
                              ? 'medium'
                              : 'regular'
                          }
                        >
                          {freq === 'daily' ? 'Daily' : 'Weekly'}
                        </Text>
                      </Card>
                    ))}
                  </Flex>
                )}
              </Flex>
            </Card>
          </Box>
        </>
      )}

      {/* Saving indicator */}
      {isSaving && (
        <Text size="2" color="gray" mt="4">
          Saving preferences...
        </Text>
      )}
    </Box>
  );
}

export default NotificationPreferences;
