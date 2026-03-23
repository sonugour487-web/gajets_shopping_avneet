interface SpecsListProps {
  specs: Record<string, string>;
}

export default function SpecsList({ specs }: SpecsListProps) {
  const entries = Object.entries(specs);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
      <h3 className="font-semibold text-foreground mb-3">Specifications</h3>
      <dl className="space-y-2">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between text-sm border-b border-border/50 pb-2 last:border-0"
          >
            <dt className="text-muted-foreground font-medium">{key}</dt>
            <dd className="text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
