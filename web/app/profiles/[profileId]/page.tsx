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
      <Stack sx={{ px: 3, py: 2, flex: 1, overflow: "hidden" }}>
        <Typography level="h1">{user.name}&apos;s Birds</Typography>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={NextLink} href="/">
            Home
          </Link>
          <Typography>{user.name}</Typography>
        </Breadcrumbs>
        <Stack sx={{ flex: 1, overflow: "hidden" }} spacing={3} direction="row">
          <Box sx={{ flex: 1, height: "100%" }}>
            <GlobalMap profiles={[user]} />
          </Box>
          <Stack
            spacing={3}
            sx={{ width: "500px", overflow: "auto", height: "100%" }}
          >
            {user.birds?.map((bird, index) => (
              <Sheet key={index} variant="soft" sx={{ p: 2 }}>
                <Typography level="title-lg">{bird.common_name}</Typography>
                <Typography sx={{ mb: 2 }}>{bird.date}</Typography>
                <Typography>Seen In: {bird.location}</Typography>
              </Sheet>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
