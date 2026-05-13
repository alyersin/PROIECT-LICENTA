import Card from "@/components/ui/Card";

export default function DashboardStatGrid({ cards = [] }) {
  return (
    <div className="app-grid app-grid-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <p className="app-card-title">{card.label}</p>
          <p className="app-card-value">{card.value ?? 0}</p>
        </Card>
      ))}
    </div>
  );
}
