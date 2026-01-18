import type { Meta, StoryObj } from '@storybook/react';
import { GradientPresetButton } from '@/components/controls/background/GradientPresetButton';

/**
 * GradientPresetButton displays a gradient preview and allows selection of preset gradients.
 * Shows a checkmark when selected and a crown for premium gradients.
 */
const meta: Meta<typeof GradientPresetButton> = {
    title: 'Background/GradientPresetButton',
    component: GradientPresetButton,
    tags: ['autodocs'],
    argTypes: {
        gradient: {
            description: 'The gradient preset configuration',
        },
        isSelected: {
            control: 'boolean',
            description: 'Whether this gradient is currently selected',
        },
        isPremium: {
            control: 'boolean',
            description: 'Whether this is a premium/pro gradient',
        },
        onClick: {
            action: 'clicked',
            description: 'Callback when the button is clicked',
        },
    },
    parameters: {
        docs: {
            description: {
                component: `
A memoized gradient preset button for the gradient picker grid.

## Features
- **Memoized**: Wrapped with \`React.memo()\` for performance
- **Visual feedback**: Checkmark overlay when selected
- **Hover tooltip**: Shows gradient name on hover
- **Premium indicator**: Crown icon for pro-only gradients
- **Accessible**: Full ARIA labels with gradient name and status
- **Performance optimized**: Uses \`content-visibility: auto\` CSS
                `,
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof GradientPresetButton>;

const oceanGradient = {
    name: 'Ocean',
    colors: ['#0ea5e9', '#8b5cf6'] as [string, string],
    angle: 135,
};

const sunsetGradient = {
    name: 'Sunset',
    colors: ['#f97316', '#ec4899'] as [string, string],
    angle: 45,
};

const forestGradient = {
    name: 'Forest',
    colors: ['#22c55e', '#065f46'] as [string, string],
    angle: 180,
};

/**
 * Default unselected gradient
 */
export const Default: Story = {
    args: {
        gradient: oceanGradient,
        isSelected: false,
        isPremium: false,
    },
};

/**
 * Selected gradient with checkmark overlay
 */
export const Selected: Story = {
    args: {
        gradient: sunsetGradient,
        isSelected: true,
        isPremium: false,
    },
};

/**
 * Premium gradient with crown indicator
 */
export const Premium: Story = {
    args: {
        gradient: forestGradient,
        isSelected: false,
        isPremium: true,
    },
};

/**
 * Grid of gradients demonstrating typical usage
 */
export const GradientGrid: Story = {
    render: () => {
        const gradients = [
            { name: 'Ocean', colors: ['#0ea5e9', '#8b5cf6'] as [string, string], angle: 135 },
            { name: 'Sunset', colors: ['#f97316', '#ec4899'] as [string, string], angle: 45 },
            { name: 'Forest', colors: ['#22c55e', '#065f46'] as [string, string], angle: 180 },
            { name: 'Aurora', colors: ['#a855f7', '#14b8a6'] as [string, string], angle: 90 },
            { name: 'Fire', colors: ['#ef4444', '#f59e0b'] as [string, string], angle: 135 },
            { name: 'Night', colors: ['#1e293b', '#475569'] as [string, string], angle: 180 },
        ];

        return (
            <div className="grid grid-cols-6 gap-2 max-w-lg">
                {gradients.map((gradient, index) => (
                    <GradientPresetButton
                        key={gradient.name}
                        gradient={gradient}
                        isSelected={index === 0}
                        isPremium={index >= 4}
                        onClick={() => console.log(`Selected: ${gradient.name}`)}
                    />
                ))}
            </div>
        );
    },
};
