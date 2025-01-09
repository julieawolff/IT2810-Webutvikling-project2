import {
  Card,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useTheme,
} from '@mui/material';
import './IngredientsList.css';

type Ingredient = {
  name: string;
  measure: string;
};

type IngredientsTableProps = {
  ingredients: Ingredient[];
};

/**
 * IngredientsList Component
 * Displays a cocktail's ingredients and their measurements in a table
 */
function IngredientsList({ ingredients }: IngredientsTableProps) {
  const theme = useTheme();

  return (
    <Card
      className="ingredients-card"
      sx={{ boxShadow: 0, backgroundColor: theme.palette.secondary.light, color: theme.palette.primary.main }}
      aria-labelledby="ingredients-title"
      tabIndex={0}
    >
      <Typography variant="h4" sx={{ fontWeight: 510 }} id="ingredients-title">
        Ingredients
      </Typography>
      <TableContainer>
        <Table aria-label="Table of ingredients and their measurements">
          <TableHead>
            <TableRow>
              <TableCell scope="col">Ingredient</TableCell>
              <TableCell scope="col" align="right">
                Measure
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow
                key={ingredient.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                aria-label={`Row for ${ingredient.name}`}
              >
                <TableCell component="th" scope="row">
                  {ingredient.name}
                </TableCell>
                <TableCell align="right">{ingredient.measure}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default IngredientsList;
