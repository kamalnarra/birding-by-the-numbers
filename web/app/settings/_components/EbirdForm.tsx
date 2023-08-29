import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { users } from "@/app/_lib/db";
import { ObjectId } from "mongodb";
import { Button, FormControl, FormLabel, Input, Typography } from "@mui/joy";
import { redirect } from "next/navigation";

export default async function EbirdForm() {
  const session = await getServerSession(authOptions);
  const user = await (await users).findOne({ email: session!.user!.email! });
  const id = user!._id.toHexString();

  async function handleSubmit(data: FormData) {
    "use server";

    await (
      await users
    ).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ebirdUsername: data.get("ebirdUsername") as string,
          ebirdPassword: data.get("ebirdPassword") as string,
        },
      },
    );

    redirect("/settings?success=true");
  }

  return (
    <form action={handleSubmit}>
      <Typography sx={{ mb: 2 }}>
        To access your birding data, we&apos;ll need access to you eBird
        account. Please enter your username and password here.
      </Typography>
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>eBird Username</FormLabel>
        <Input name="ebirdUsername" />
      </FormControl>
      <FormControl sx={{ mb: 2 }}>
        <FormLabel>eBird Password</FormLabel>
        <Input name="ebirdPassword" type="password" />
      </FormControl>
      <Button type="submit">Submit</Button>
    </form>
  );
}
