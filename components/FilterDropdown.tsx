import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  SelectChangeEvent,
  Box
} from '@mui/material';
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface FilterDropdownProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  label?: string;
  fullWidth?: boolean;
}

export default function FilterDropdown({ 
  categories, 
  selected, 
  onSelect,
  label = "All Categories",
  fullWidth = true
}: FilterDropdownProps) {
  
  const handleChange = (event: SelectChangeEvent) => {
    onSelect(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel id="category-filter-label">{label}</InputLabel>
      <Select
        labelId="category-filter-label"
        value={selected}
        label={label}
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 2,
          },
        }}
      >
        <MenuItem value="">
          <em>All Categories</em>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}