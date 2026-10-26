export function Prose({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/);
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
        <p key={index} className="text-base leading-7">
          {block}
        </p>
      ))}
    </div>
  );
}
