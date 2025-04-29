import BroadcastForm from "@/components/admin/broadcasts/broadcast-form";

export const metadata = {
  title: "Create Broadcast - WaveStream Admin",
};

export default function NewBroadcastPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Create New Broadcast</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <BroadcastForm />
      </div>
    </div>
  );
}
