interface OpeningHours {
  [day: string]: { open: string; close: string } | null;
}

const daysOrder = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];

export default function OpeningHoursDisplay({ openingHours }: { openingHours: OpeningHours }) {
  return (
    <div className="text-sm">
      {daysOrder.map((day) => {
        const hours = openingHours[day];
        return (
          <div key={day} className="flex justify-between capitalize">
            <span>{day}</span>
            <span>{hours ? `${hours.open} - ${hours.close}` : "Fermé"}</span>
          </div>
        );
      })}
    </div>
  );
}