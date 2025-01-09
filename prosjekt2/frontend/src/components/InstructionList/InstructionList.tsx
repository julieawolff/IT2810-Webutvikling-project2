import { Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import './InstructionList.css';

type InstructionListProps = {
  instructions: string;
};

/**
 * InstructionList Component
 * Displays a list of instructions for making a cocktail
 */
function InstructionList({ instructions }: InstructionListProps) {
  // Divide instructions into a list since it is saved as a text string in the database
  const instructionsList = instructions.split('.').filter((sentence) => sentence.trim() !== '');

  return (
    <>
      <Container
        className="instructions-container"
        sx={{ backgroundColor: (theme) => theme.palette.secondary.dark }}
        aria-labelledby="instructions-title"
        tabIndex={0}
      >
        <Typography variant="h4" className="instructions-title" sx={{ fontWeight: 600 }} id="instructions-title">
          Instructions
        </Typography>
        <List className="instructions-list" aria-describedby="instructions-title">
          {instructionsList.map((value, index) => (
            <ListItem key={index} className="instructions-list-item" aria-label={`Step ${index + 1}: ${value.trim()}`}>
              <ListItemText primary={value} sx={{ color: (theme) => theme.palette.secondary.contrastText }} />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
}

export default InstructionList;
