import type { Meta, StoryObj } from '@storybook/react';
import { ColorButton } from '@/components/controls/background/ColorButton';

/**
 * ColorButton is a memoized button component for selecting solid colors in the background picker.
 * It supports premium indicators and accessibility features.
 */
const meta: Meta<typeof ColorButton> = {
    title: 'Background/ColorButton',
    component: ColorButton,
    tags: ['autodocs'],
    argTypes: {
        color: {
            control: 'color',
            description: 'The hex color value to display',
        },
        isSelected: {
            control: 'boolean',
            description: 'Whether this color is currently selected',
        },
        isPremium: {
            control: 'boolean',
            description: 'Whether this is a premium/pro color',
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
A memoized color button component used in the solid color picker grid.

## Features
- **Memoized**: Wrapped with \`React.memo()\` to prevent unnecessary re-renders
- **Accessible**: Full ARIA labels including color value, premium status, and selection state
- **Focus visible**: Clear focus ring for keyboard navigation
- **Premium indicator**: Crown icon for pro-only colors
- **Performance optimized**: Uses \`content-visibility: auto\` CSS for virtualization
                `,
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof ColorButton>;

/**
 * Default state - an unselected, free color
 */
export const Default: Story = {
    args: {
        color: '#0ea5e9',
        isSelected: false,
        isPremium: false,
    },
};

/**
 * Selected state with visual emphasis
 */
export const Selected: Story = {
    args: {
        color: '#8b5cf6',
        isSelected: true,
        isPremium: false,
    },
};

/**
 * Premium color with crown indicator
 */
export const Premium: Story = {
    args: {
        color: '#f59e0b',
        isSelected: false,
        isPremium: true,
    },
};

/**
 * Selected premium color
 */
export const PremiumSelected: Story = {
    args: {
        color: '#ef4444',
        isSelected: true,
        isPremium: true,
    },
};

/**
 * Grid of multiple colors demonstrating the typical usage
 */
export const ColorGrid: Story = {
    render: () => (
        <div className="grid grid-cols-8 gap-1.5 max-w-md">
            {['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6', '#0ea5e9', '#8b5cf6'].map((color, index) => (
                <ColorButton
                    key={color}
                    color={color}
                    isSelected={index === 2}
                    isPremium={index >= 6}
                    onClick={() => console.log(`Selected: ${color}`)}
                />
            ))}
        </div>
    ),
};
