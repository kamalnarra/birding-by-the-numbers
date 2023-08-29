import { Breadcrumbs, Link, Typography, Stack, Box, Sheet } from "@mui/joy";
import NextLink from "next/link";
import { users } from "@/app/_lib/db";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import GlobalMap from "@/app/_components/GlobalMap";

export default async function BirdPage({
  params,
}: {
  params: { profileId: string };
}) {
  const user = await (
    await users
  ).findOne({ _id: new ObjectId(params.profileId) });
  if (!user) notFound();

  return (
    <>
      <Breadcrumbs sx={{ px: 3, py: 2 }}>
        <Link component={NextLink} href="/">
          Home
        </Link>
        <Typography>{user.name}</Typography>
      </Breadcrumbs>
      <Stack sx={{ px: 3, py: 2, flex: 1 }} spacing={3}>
        <Typography level="h3">{user.name}&apos;s Birds</Typography>
        <Stack
          sx={{ flex: 1, alignItems: "stretch" }}
          spacing={3}
          direction="row"
        >
          <Box sx={{ flex: 1 }}>
            <GlobalMap profiles={[user]} />
          </Box>
          <Stack spacing={3} sx={{ width: "200px" }}>
            {user.birds?.map((bird) => (
              <Sheet
                component={NextLink}
                href={`/profiles/${params.profileId}/birds/${bird.id}`}
                key={bird.id}
                variant="soft"
                sx={{ p: 2, textDecoration: "none" }}
              >
                <Typography level="title-lg" sx={{ mb: 2 }}>
                  {bird.name}
                </Typography>
                <Typography>Seen In: {bird.locationName}</Typography>
              </Sheet>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
