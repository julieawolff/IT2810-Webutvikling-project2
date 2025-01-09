import { TextField, useTheme } from '@mui/material';
import LongMenu from '../LongMenu/LongMenu';
import './FilterAndSearch.css';
import MultipleSelect from '../MultipleSelect/MultipleSelect';

const alcohol_content = ['Amaretto', 'Brandy', 'Gin', 'Rum', 'Tequila', 'Vodka', 'Non-alcoholic'];
const sorting = ['Rating High-Low', 'Rating Low-High', 'Name A-Z', 'Name Z-A'];

interface FilterAndSearchProps {
  handleFiltering: (filter: string[]) => void;
  handleSorting: (sort: string) => void;
  handleSearch: (searchPrefix: string) => void;
  initialSort: string;
  initialFilter: string[];
}

/**
 * FilterAndSearch Component
 * Holds the components for filtering, sorting and seaching through the cocktails
 */
function FilterAndSearch({
  handleFiltering,
  handleSorting,
  handleSearch,
  initialSort,
  initialFilter,
}: FilterAndSearchProps) {
  const theme = useTheme();

  return (
    <form className="filter-and-search">
      <MultipleSelect
        name="Filter"
        options={alcohol_content}
        handleChange={handleFiltering}
        initialOption={initialFilter}
      />
      <LongMenu name="Sorting" options={sorting} handleChange={handleSorting} initialOption={initialSort} />
      <TextField
        placeholder="Are you ready for it?"
        className="search"
        label="Search"
        onChange={(e) => handleSearch(e.target.value)}
        autoComplete="off"
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
      />
    </form>
  );
}

export default FilterAndSearch;
