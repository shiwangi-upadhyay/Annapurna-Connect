// src/app/dashboard/profile/edit/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import EditProfileForm from "@/components/Profile/EditProfileForm";

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  return (
    <div className="pb-20 pt-8">
      <EditProfileForm user={user} />
    </div>
  );
}