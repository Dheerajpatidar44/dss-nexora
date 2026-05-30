import UserHeader from "@/components/user/UserHeader";
import UserFooter from "@/components/user/UserFooter";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      <main className="min-h-[60vh]">{children}</main>
      <UserFooter />
    </div>
  );
}
