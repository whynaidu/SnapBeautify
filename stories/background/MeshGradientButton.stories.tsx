import type { Meta, StoryObj } from '@storybook/react';
import { MeshGradientButton } from '@/components/controls/background/MeshGradientButton';

/**
 * MeshGradientButton displays complex mesh gradient backgrounds as selectable presets.
 * Mesh gradients create more organic, multi-color gradient effects.
 */
const meta: Meta<typeof MeshGradientButton> = {
    title: 'Background/MeshGradientButton',
    component: MeshGradientButton,
    tags: ['autodocs'],
    argTypes: {
        mesh: {
            description: 'The mesh gradient configuration with CSS and name',
        },
        isSelected: {
            control: 'boolean',
            description: 'Whether this mesh gradient is currently selected',
        },
        isPremium: {
            control: 'boolean',
            description: 'Whether this is a premium/pro mesh gradient',
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
A memoized mesh gradient button for the gradient picker.

## Features
- **Complex gradients**: Supports CSS radial gradients and mesh effects
- **Memoized**: Wrapped with \`React.memo()\` for performance
- **Visual feedback**: Checkmark overlay when selected
- **Hover tooltip**: Shows gradient name on hover
- **Premium indicator**: Crown icon for pro-only gradients
- **Performance optimized**: Uses \`content-visibility: auto\` CSS
                `,
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof MeshGradientButton>;

const auroraBoreal = {
    name: 'Aurora Boreal',
    css: `radial-gradient(at 40% 20%, #0ea5e9 0px, transparent 50%),
          radial-gradient(at 80% 0%, #8b5cf6 0px, transparent 50%),
          radial-gradient(at 0% 50%, #14b8a6 0px, transparent 50%),
          radial-gradient(at 80% 50%, #f97316 0px, transparent 50%),
          radial-gradient(at 0% 100%, #ef4444 0px, transparent 50%)`,
};

const cosmicDust = {
    name: 'Cosmic Dust',
    css: `radial-gradient(at 0% 0%, #a855f7 0px, transparent 50%),
          radial-gradient(at 100% 100%, #f43f5e 0px, transparent 50%),
          radial-gradient(at 50% 50%, #0ea5e9 0px, transparent 70%)`,
};

const deepOcean = {
    name: 'Deep Ocean',
    css: `radial-gradient(at 20% 80%, #0ea5e9 0px, transparent 60%),
          radial-gradient(at 80% 20%, #1e3a8a 0px, transparent 60%),
          radial-gradient(at 50% 50%, #0c4a6e 0px, transparent 80%)`,
};

/**
 * Default unselected mesh gradient
 */
export const Default: Story = {
    args: {
        mesh: auroraBoreal,
        isSelected: false,
        isPremium: false,
    },
};

/**
 * Selected mesh gradient with checkmark overlay
 */
export const Selected: Story = {
    args: {
        mesh: cosmicDust,
        isSelected: true,
        isPremium: false,
    },
};

/**
 * Premium mesh gradient with crown indicator
 */
export const Premium: Story = {
    args: {
        mesh: deepOcean,
        isSelected: false,
        isPremium: true,
    },
};

/**
 * Grid of mesh gradients demonstrating typical usage
 */
export const MeshGrid: Story = {
    render: () => {
        const meshGradients = [
            auroraBoreal,
            cosmicDust,
            deepOcean,
            {
                name: 'Sunset Glow',
                css: `radial-gradient(at 30% 30%, #f97316 0px, transparent 50%),
                      radial-gradient(at 70% 70%, #ec4899 0px, transparent 50%),
                      radial-gradient(at 50% 100%, #eab308 0px, transparent 60%)`,
            },
            {
                name: 'Northern Lights',
                css: `radial-gradient(at 0% 50%, #22c55e 0px, transparent 50%),
                      radial-gradient(at 100% 50%, #0ea5e9 0px, transparent 50%),
                      radial-gradient(at 50% 0%, #a855f7 0px, transparent 60%)`,
            },
        ];

        return (
            <div className="grid grid-cols-5 gap-2 max-w-lg">
                {meshGradients.map((mesh, index) => (
                    <MeshGradientButton
                        key={mesh.name}
                        mesh={mesh}
                        isSelected={index === 0}
                        isPremium={index >= 3}
                        onClick={() => console.log(`Selected: ${mesh.name}`)}
                    />
                ))}
            </div>
        );
    },
};
