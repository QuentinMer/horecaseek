
interface OpeningHours {
  [day: string]: { open: string; close: string } | null;
}

export default function OpeningHoursDisplay({ openingHours }: { openingHours: OpeningHours }) {
  return (
    <div className="text-sm">
      {Object.entries(openingHours).map(([day, hours]) => (
        <div key={day} className="flex justify-between capitalize">
          <span>{day}</span>
          <span>{hours ? `${hours.open} - ${hours.close}` : "Fermé"}</span>
        </div>
      ))}
    </div>
  );
}