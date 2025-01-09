import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import { useState } from 'react';
import './MultipleSelect.css';
import CheckIcon from '@mui/icons-material/Check';

interface MultipleSelectProps {
  name: string;
  options: string[];
  handleChange: (filter: string[]) => void;
  initialOption?: string[];
}

/**
 * MultipleSelect Component
 * Dropdown menu for selecting multiple options
 */
export default function MultipleSelect({ name, options, handleChange, initialOption }: MultipleSelectProps) {
  const [selectedOption, setSelectedOption] = useState<string[]>(initialOption || []);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const handleNewValue = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedOption(Array.isArray(value) ? value : [value]);
    handleChange(Array.isArray(value) ? value : [value]);
  };

  const handleDropdownToggle = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <FormControl className="outer-box">
      <InputLabel id="Multi-select-label">{name}</InputLabel>
      <Select
        data-testid="filtering-options"
        labelId="Multi-select-label"
        id="Multi-select"
        className="menu-item"
        multiple
        value={selectedOption}
        label={name}
        onChange={handleNewValue}
        onOpen={() => handleDropdownToggle(true)}
        onClose={() => handleDropdownToggle(false)}
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
        renderValue={(selected) => <span>{selected.join(', ')}</span>}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}{' '}
            {selectedOption.includes(option) && isOpen ? (
              <CheckIcon fontSize="small" sx={{ paddingTop: '1px', paddingLeft: '3px' }} />
            ) : null}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
