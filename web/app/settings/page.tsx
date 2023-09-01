import { Alert, Container, Typography } from "@mui/joy";
import EbirdForm from "./_components/EbirdForm";

export default function SettingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  return (
    <Container sx={{ px: 3, py: 2 }}>
      {searchParams.success && (
        <Alert color="success" sx={{ mb: 2 }}>
          Success
        </Alert>
      )}
      <Typography level="h1" sx={{ mb: 2 }}>
        Settings
      </Typography>
      <EbirdForm />
    </Container>
  );
}
