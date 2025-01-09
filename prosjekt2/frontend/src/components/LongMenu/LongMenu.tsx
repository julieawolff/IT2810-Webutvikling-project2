import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import { useState } from 'react';
import './LongMenu.css';

interface LongMenuProps {
  name: string;
  options: string[];
  handleChange: (filter: string) => void;
  initialOption?: string;
}

/**
 * LongMenu Component
 * Dropdown menu for selecting a single option
 */
export default function LongMenu({ name, options, handleChange, initialOption }: LongMenuProps) {
  const [selectedOption, setSelectedOption] = useState(initialOption || '');
  const theme = useTheme();

  const handleNewValue = (event: SelectChangeEvent) => {
    const value = event.target.value as string;
    setSelectedOption(value);
    handleChange(value);
  };

  return (
    <FormControl className="outer-select-box">
      <InputLabel id="select-label">{name}</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={selectedOption}
        label={name}
        onChange={handleNewValue}
        aria-live="polite"
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '& .MuiSelect-icon': {
            color: theme.palette.primary.main,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option} aria-selected={selectedOption === option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
