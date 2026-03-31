import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const commissionData = [
  { month: "Out", value: 2400 },
  { month: "Nov", value: 1800 },
  { month: "Dez", value: 3200 },
  { month: "Jan", value: 2800 },
  { month: "Fev", value: 1500 },
  { month: "Mar", value: 3200 },
];

const pipelineData = [
  { stage: "Disponível", count: 2 },
  { stage: "Contato Ativo", count: 2 },
  { stage: "Proposta", count: 1 },
  { stage: "Vendido", count: 1 },
  { stage: "Arquivado", count: 1 },
];

const typeData = [
  { name: "Motos", value: 3 },
  { name: "Carros", value: 4 },
];

const avgTimeData = [
  { model: "CG 160", days: 5 },
  { model: "Gol 1.0", days: 12 },
  { model: "Fazer 250", days: 20 },
  { model: "Argo", days: 30 },
  { model: "CB 300F", days: 3 },
  { model: "Onix Plus", days: 8 },
];

const GOLD = "#c9a227";
const GOLD_LIGHT = "#d4b84a";
const COLORS = [GOLD, "#888888"];

export default function Analytics() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission per month */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Comissão por mês (R$)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={commissionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis tick={{ fill: "#888", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="value" fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline funnel */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Pipeline Funnel</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis type="number" tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis dataKey="stage" type="category" tick={{ fill: "#888", fontSize: 11 }} width={100} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="count" fill={GOLD_LIGHT} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Type distribution */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Distribuição por tipo</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {typeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Avg time */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Tempo médio no pipeline (dias)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={avgTimeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis type="number" tick={{ fill: "#888", fontSize: 12 }} />
              <YAxis dataKey="model" type="category" tick={{ fill: "#888", fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="days" fill={GOLD} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
