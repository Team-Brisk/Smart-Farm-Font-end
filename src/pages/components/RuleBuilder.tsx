import React, { useState } from "react";

type Rule = {
  field: string;
  operator: string;
  value: number;
  action: string;
};

type RuleBuilderProps = {
  addRule: (rule: Rule) => void;
};

export default function RuleBuilder({ addRule }: RuleBuilderProps) {
  const [field, setField] = useState("temperature");
  const [operator, setOperator] = useState(">");
  const [value, setValue] = useState("");
  const [action, setAction] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !action) return alert("กรุณากรอกค่าทั้งหมด");
    addRule({ field, operator, value: Number(value), action });
    setValue("");
    setAction("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <div className="flex gap-2">
        <select value={field} onChange={(e) => setField(e.target.value)}>
          <option value="temperature">temperature</option>
          <option value="humidity">humidity</option>
        </select>

        <select value={operator} onChange={(e) => setOperator(e.target.value)}>
          <option value=">">&gt;</option>
          <option value="<">&lt;</option>
          <option value="=">=</option>
        </select>

        <input
          type="number"
          placeholder="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <input
        type="text"
        placeholder="action (e.g. turn_on_fan)"
        value={action}
        onChange={(e) => setAction(e.target.value)}
      />

      <button type="submit">➕ Add Rule</button>
    </form>
  );
}
