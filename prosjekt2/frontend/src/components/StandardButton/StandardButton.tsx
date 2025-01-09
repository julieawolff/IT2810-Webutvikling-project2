import { Button } from '@mui/material';

type ResponsiveSize = {
  xs?: string | number;
  sm?: string | number;
  md?: string | number;
  lg?: string | number;
  xl?: string | number;
};

type StandardButtonProps = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  startIcon?: React.ReactNode;
  color?: string;
  width?: ResponsiveSize | string | number;
  height?: ResponsiveSize | string | number;
  ariaLabel?: string;
};

/**
 * StandardButton Component
 * Displays a button with text and optional icon, color, width and height
 */
function StandardButton({
  text,
  onClick,
  disabled = false,
  variant = 'contained',
  startIcon,
  color = '#D01C49',
  width,
  height,
  ariaLabel,
}: StandardButtonProps) {
  return (
    <>
      <Button
        onClick={onClick}
        disabled={disabled}
        variant={variant}
        startIcon={startIcon}
        sx={{ backgroundColor: color, width: width, height: height }}
        aria-label={ariaLabel || text}
      >
        {text}
      </Button>
    </>
  );
}

export default StandardButton;
