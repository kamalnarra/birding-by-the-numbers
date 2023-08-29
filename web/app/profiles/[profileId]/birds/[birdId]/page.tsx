import { Box, Breadcrumbs, Link, Typography } from "@mui/joy";
import NextLink from "next/link";
import { users } from "@/app/_lib/db";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

export default async function BirdPage({
  params,
}: {
  params: { birdId: string; profileId: string };
}) {
  const user = await (
    await users
  ).findOne({ _id: new ObjectId(params.profileId) });
  if (!user) notFound();
  const bird = user.birds?.find((x) => x.id === params.birdId);
  if (!bird) notFound();

  return (
    <>
      <Breadcrumbs sx={{ px: 3, py: 2 }}>
        <Link component={NextLink} href="/">
          Home
        </Link>
        <Link component={NextLink} href={`/profiles/${params.profileId}`}>
          {user.name}
        </Link>
        <Typography>{bird.name}</Typography>
      </Breadcrumbs>
      <Box sx={{ px: 3, py: 2 }}>
        <Typography level="h3">{bird.name}</Typography>
      </Box>
    </>
  );
}
