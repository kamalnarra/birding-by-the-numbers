import GlobalMap from "@/app/GlobalMap";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { users } from "@/app/_lib/db";
import EbirdForm from "@/app/EbirdForm";
import { addUser } from "./_lib/mq";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = await (await users).findOne({ email: session!.user!.email! });
  if (!user) {
    const newUser = await (
      await users
    ).insertOne({ email: session!.user!.email! });
    await addUser(newUser.insertedId.toHexString());
  }
  const profiles = await (await users).find().limit(5).toArray();

  return (
    <div className="h-screen w-screen flex flex-col">
      <EbirdForm />
      <GlobalMap />
      <div className="flex p-4 gap-4">
        {profiles.map((profile) => (
          <div
            className="p-4 bg-gray-200 rounded-lg text-xl"
            key={profile._id.toHexString()}
          >
            <Link href={`/profile/${profile._id.toHexString()}`}>
              {profile.email} (updated {profile.updated})
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
