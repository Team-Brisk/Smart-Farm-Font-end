import React, { useState } from "react";

type Rule = {
  field: string;
  operator: string;
  value: number;
  action: string;
};

type RuleEngineProps = {
  rules: Rule[];
};

export default function RuleEngine({ rules }: RuleEngineProps) {
  const [input, setInput] = useState({ temperature: "", humidity: "" });
  const [results, setResults] = useState<string[]>([]);

  const evaluateRules = () => {
    const triggered = rules.filter((r) => {
      const val = Number(input[r.field as keyof typeof input]);
      switch (r.operator) {
        case ">":
          return val > r.value;
        case "<":
          return val < r.value;
        case "=":
          return val === r.value;
        default:
          return false;
      }
    });
    setResults(triggered.map((r) => r.action));
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">Test Rule Engine</h2>
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder="temperature"
          value={input.temperature}
          onChange={(e) => setInput({ ...input, temperature: e.target.value })}
        />
        <input
          type="number"
          placeholder="humidity"
          value={input.humidity}
          onChange={(e) => setInput({ ...input, humidity: e.target.value })}
        />
      </div>
      <button onClick={evaluateRules}>⚡ Evaluate</button>

      <div className="mt-3">
        <h3 className="font-medium">Triggered Actions:</h3>
        {results.length > 0 ? (
          <ul>
            {results.map((a, i) => (
              <li key={i}>✅ {a}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No actions triggered</p>
        )}
      </div>
    </div>
  );
}
