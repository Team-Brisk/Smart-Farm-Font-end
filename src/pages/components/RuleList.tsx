import React from "react";

type Rule = {
  field: string;
  operator: string;
  value: number;
  action: string;
};

type RuleListProps = {
  rules: Rule[];
};

export default function RuleList({ rules }: RuleListProps) {
  if (rules.length === 0)
    return <p className="text-gray-500">ยังไม่มี rule</p>;

  return (
    <ul className="mb-6 border p-3 rounded">
      {rules.map((r, i) => (
        <li key={i}>
          IF <b>{r.field}</b> {r.operator} <b>{r.value}</b> → <i>{r.action}</i>
        </li>
      ))}
    </ul>
  );
}
