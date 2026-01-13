import {
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Chip,
  
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function SearchBar({
  value,
  onChange,
  categories = [],
  selectedCategory = "",
  onCategoryChange,
}: SearchBarProps) {
  const handleClear = () => {
    onChange("");
    if (onCategoryChange) onCategoryChange("");
  };

  const handleCategorySelect = (newValue: string | null) => {
    if (onCategoryChange) {
      onCategoryChange(newValue || "");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search products by name or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                size="small"
                aria-label="clear search"
              ></IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
              borderWidth: 2,
            },
          },
        }}
      />

      {(value || selectedCategory) && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {value && (
            <Chip
              label={`Search: "${value}"`}
              onDelete={() => onChange("")}
              color="primary"
              size="small"
              variant="outlined"
            />
          )}
          {selectedCategory && (
            <Chip
              label={`Category: ${selectedCategory}`}
              onDelete={() => onCategoryChange?.("")}
              color="secondary"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
}
