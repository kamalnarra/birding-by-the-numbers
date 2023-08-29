import { Stack, Link } from "@mui/joy";
import NextLink from "next/link";

export default function Navbar() {
  return (
    <Stack
      direction="row"
      sx={{
        mx: 3,
        py: 2,
        justifyContent: "space-between",
        borderBottom: "1px solid",
      }}
    >
      <Stack direction="row" spacing={3}>
        <Link component={NextLink} href="/" color="neutral" level="title-lg">
          Birding by the Numbers
        </Link>
      </Stack>

      <Stack direction="row" spacing={3}>
        <Link component={NextLink} href="/" color="neutral">
          Explore
        </Link>
        <Link component={NextLink} href="/settings" color="neutral">
          Settings
        </Link>
      </Stack>
    </Stack>
  );
}
