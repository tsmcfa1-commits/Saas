import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-graph';
import { MotiView } from 'moti';
import useAivyTheme from '@/utils/theme';

const { width: screenWidth } = Dimensions.get('window');

export default function WeeklyCaloriesChart({ data, onPress }) {
  const theme = useAivyTheme();

  // Sample data if none provided
  const chartData = data || [
    { value: 1850, date: new Date('2024-10-21') },
    { value: 2100, date: new Date('2024-10-22') },
    { value: 1950, date: new Date('2024-10-23') },
    { value: 2250, date: new Date('2024-10-24') },
    { value: 1800, date: new Date('2024-10-25') },
    { value: 2050, date: new Date('2024-10-26') },
    { value: 1900, date: new Date('2024-10-27') },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  const average = Math.round(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 800 }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          marginHorizontal: theme.spacing.lg,
          marginBottom: theme.spacing.lg,
          ...theme.shadows.md,
        }}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
                marginBottom: 4,
              }}
            >
              Weekly Calories
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: theme.colors.textSecondary,
                fontFamily: 'Inter_400Regular',
              }}
            >
              Last 7 days • Avg: {average} cal
            </Text>
          </View>
          
          <View
            style={{
              backgroundColor: `${theme.colors.calories}20`,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: 4,
              borderRadius: theme.borderRadius.sm,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: theme.colors.calories,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              Tap to view
            </Text>
          </View>
        </View>

        <View style={{ height: 120, marginBottom: theme.spacing.sm }}>
          <LineChart
            style={{ height: 120, width: '100%' }}
            points={chartData}
            animated={true}
            color={theme.colors.calories}
            gradientFillColors={[`${theme.colors.calories}40`, `${theme.colors.calories}10`]}
            enablePanGesture={false}
            enableIndicator={true}
            indicatorPulseBlurRadius={8}
            lineThickness={3}
            verticalPadding={20}
            horizontalPadding={0}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: theme.spacing.sm,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '400',
                color: theme.colors.textTertiary,
                fontFamily: 'Inter_400Regular',
                marginBottom: 2,
              }}
            >
              Min
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              {minValue}
            </Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '400',
                color: theme.colors.textTertiary,
                fontFamily: 'Inter_400Regular',
                marginBottom: 2,
              }}
            >
              Max
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              {maxValue}
            </Text>
          </View>
          
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '400',
                color: theme.colors.textTertiary,
                fontFamily: 'Inter_400Regular',
                marginBottom: 2,
              }}
            >
              Today
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: theme.colors.calories,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              {chartData[chartData.length - 1]?.value || 0}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}