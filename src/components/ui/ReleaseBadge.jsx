import { Chip } from '@mui/material';

function ReleaseBadge({ label = 'VERSAO V1.0', sx = {} }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        borderRadius: 0,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: 'secondary.main',
        border: '1px solid rgba(166, 77, 19, 0.35)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        ...sx,
      }}
    />
  );
}

export default ReleaseBadge;
