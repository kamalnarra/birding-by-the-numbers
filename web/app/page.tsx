import GlobalMap from "./_components/GlobalMap";
import NextLink from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { client, users } from "@/app/_lib/db";
import { addUser } from "./_lib/mq";
import { Sheet, Stack, Typography, Box } from "@mui/joy";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = await (await users).findOne({ email: session!.user!.email! });
  if (!user) {
    await (
      await client
    ).withSession(async (s) => {
      await s.withTransaction(async () => {
        const newUser = await (
          await users
        ).insertOne({
          email: session!.user!.email!,
          name: session!.user!.name!,
        });
        await addUser(newUser.insertedId.toHexString());
      });
    });
  }

  const profiles = await (await users).find().toArray();

  return (
    <Stack sx={{ flex: 1, px: 3, py: 2 }} spacing={3}>
      <Stack sx={{ flex: 1 }}>
        <Typography level="h3" sx={{ mb: 2 }}>
          All Sightings
        </Typography>
        <GlobalMap profiles={profiles} />
      </Stack>
      <Box>
        <Typography level="h3" sx={{ mb: 2 }}>
          Featured Profiles
        </Typography>
        <Stack direction="row" spacing={3}>
          {profiles
            .sort(() => 0.5 - Math.random())
            .slice(0, 5)
            .map((profile) => (
              <Sheet
                component={NextLink}
                href={`/profiles/${profile._id.toHexString()}`}
                key={profile._id.toHexString()}
                variant="soft"
                sx={{ p: 2, textDecoration: "none" }}
              >
                <Typography level="title-lg" sx={{ mb: 2 }}>
                  {profile.name}
                </Typography>
                <Typography>
                  Total Birds: {profile.birds?.length ?? 0}
                </Typography>
              </Sheet>
            ))}
        </Stack>
      </Box>
    </Stack>
  );
}
