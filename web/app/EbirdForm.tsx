import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { users } from "@/app/_lib/db";
import { ObjectId } from "mongodb";

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
      }
    );
  }

  return (
    <form action={handleSubmit}>
      <input type="text" name="ebirdUsername" placeholder="eBird Username" />
      <input
        type="password"
        name="ebirdPassword"
        placeholder="eBird Password"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
