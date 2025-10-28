import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-graph';
import { MotiView } from 'moti';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react-native';
import useAivyTheme from '@/utils/theme';

export default function WeightProgressChart({ data, onPress }) {
  const theme = useAivyTheme();

  // Sample data if none provided
  const chartData = data || [
    { value: 75.2, date: new Date('2024-10-01') },
    { value: 74.8, date: new Date('2024-10-08') },
    { value: 74.5, date: new Date('2024-10-15') },
    { value: 74.1, date: new Date('2024-10-22') },
    { value: 73.9, date: new Date('2024-10-26') },
  ];

  const startWeight = chartData[0]?.value || 0;
  const currentWeight = chartData[chartData.length - 1]?.value || 0;
  const weightChange = currentWeight - startWeight;
  const percentChange = ((weightChange / startWeight) * 100).toFixed(1);

  const getTrendIcon = () => {
    if (weightChange > 0.1) return <TrendingUp size={16} color={theme.colors.error} />;
    if (weightChange < -0.1) return <TrendingDown size={16} color={theme.colors.success} />;
    return <Minus size={16} color={theme.colors.textTertiary} />;
  };

  const getTrendColor = () => {
    if (weightChange > 0.1) return theme.colors.error;
    if (weightChange < -0.1) return theme.colors.success;
    return theme.colors.textTertiary;
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 200, duration: 800 }}
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
              Weight Progress
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: theme.colors.textSecondary,
                fontFamily: 'Inter_400Regular',
              }}
            >
              Last 30 days
            </Text>
          </View>
          
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: `${getTrendColor()}20`,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: 4,
              borderRadius: theme.borderRadius.sm,
            }}
          >
            {getTrendIcon()}
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: getTrendColor(),
                fontFamily: 'Inter_600SemiBold',
                marginLeft: 4,
              }}
            >
              {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)}kg
            </Text>
          </View>
        </View>

        <View style={{ height: 100, marginBottom: theme.spacing.sm }}>
          <LineChart
            style={{ height: 100, width: '100%' }}
            points={chartData}
            animated={true}
            color={getTrendColor()}
            gradientFillColors={[`${getTrendColor()}30`, `${getTrendColor()}05`]}
            enablePanGesture={false}
            enableIndicator={true}
            indicatorPulseBlurRadius={6}
            lineThickness={2.5}
            verticalPadding={15}
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
              Start
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              {startWeight}kg
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
              Current
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: theme.colors.text,
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              {currentWeight}kg
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
              Change %
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: getTrendColor(),
                fontFamily: 'Inter_600SemiBold',
              }}
            >
              {percentChange}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}