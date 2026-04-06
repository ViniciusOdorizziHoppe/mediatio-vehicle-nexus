import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateVehicle, useUpdateVehicle, useVehicle } from '@/hooks/use-vehicles';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existingData } = useVehicle(id);
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();

  const [form, setForm] = useState({
    tipo: 'moto', marca: '', modelo: '', ano: new Date().getFullYear(), cor: '', km: '',
    precos: { compra: '', venda: '', minimo: '', comissaoEstimada: '' },
    condicoes: { aceitaTroca: false, aceitaFinanciamento: false, documentacao: 'pendente' },
    proprietario: { nome: '', whatsapp: '', cidade: '' },
    anuncio: { observacoes: '' },
  });

  useEffect(() => {
    if (existingData) {
      const v = existingData;
      setForm({
        tipo: v.tipo, marca: v.marca, modelo: v.modelo, ano: v.ano, cor: v.cor || '', km: String(v.km || ''),
        precos: { compra: String(v.precos?.compra || ''), venda: String(v.precos?.venda || ''), minimo: String(v.precos?.minimo || ''), comissaoEstimada: String(v.precos?.comissaoEstimada || '') },
        condicoes: { aceitaTroca: v.condicoes?.aceitaTroca || false, aceitaFinanciamento: v.condicoes?.aceitaFinanciamento || false, documentacao: v.condicoes?.documentacao || 'pendente' },
        proprietario: { nome: v.proprietario?.nome || '', whatsapp: v.proprietario?.whatsapp || '', cidade: v.proprietario?.cidade || '' },
        anuncio: { observacoes: v.anuncio?.observacoes || '' },
      });
    }
  }, [existingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      tipo: form.tipo, marca: form.marca, modelo: form.modelo, ano: Number(form.ano), cor: form.cor,
      km: form.km ? Number(form.km) : undefined,
      precos: { compra: form.precos.compra ? Number(form.precos.compra) : undefined, venda: Number(form.precos.venda), minimo: form.precos.minimo ? Number(form.precos.minimo) : undefined, comissaoEstimada: form.precos.comissaoEstimada ? Number(form.precos.comissaoEstimada) : undefined },
      condicoes: form.condicoes, proprietario: form.proprietario, anuncio: form.anuncio,
    };
    try {
      if (isEdit && id) { await updateMutation.mutateAsync({ id, ...payload }); }
      else { await createMutation.mutateAsync(payload); }
      toast.success(isEdit ? 'Veículo atualizado' : 'Veículo cadastrado');
      navigate('/vehicles');
    } catch (err: any) { toast.error(err.message || 'Erro ao salvar'); }
  };

  const loading = createMutation.isPending || updateMutation.isPending;
  const inputClass = "w-full h-9 px-3 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

  return (
    <div className="p-6 max-w-2xl animate-fade-in">
      <button onClick={() => navigate('/vehicles')} className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Voltar para veículos
      </button>

      <h2 className="text-lg font-semibold text-foreground mb-5">{isEdit ? 'Editar Veículo' : 'Novo Veículo'}</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Section title="Dados do Veículo">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo *">
              <select value={form.tipo} onChange={e => setForm(f => ({...f, tipo: e.target.value}))} className={inputClass}>
                <option value="moto">Moto</option><option value="carro">Carro</option>
              </select>
            </Field>
            <Field label="Marca *"><input required value={form.marca} onChange={e => setForm(f => ({...f, marca: e.target.value}))} className={inputClass} placeholder="Honda, Toyota..." /></Field>
            <Field label="Modelo *"><input required value={form.modelo} onChange={e => setForm(f => ({...f, modelo: e.target.value}))} className={inputClass} placeholder="CG 160, Civic..." /></Field>
            <Field label="Ano *"><input required type="number" value={form.ano} onChange={e => setForm(f => ({...f, ano: Number(e.target.value)}))} className={inputClass} /></Field>
            <Field label="Cor"><input value={form.cor} onChange={e => setForm(f => ({...f, cor: e.target.value}))} className={inputClass} placeholder="Vermelha..." /></Field>
            <Field label="KM"><input type="number" value={form.km} onChange={e => setForm(f => ({...f, km: e.target.value}))} className={inputClass} placeholder="15000" /></Field>
          </div>
        </Section>

        <Section title="Preços">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Compra (R$)"><input type="number" value={form.precos.compra} onChange={e => setForm(f => ({...f, precos: {...f.precos, compra: e.target.value}}))} className={inputClass} /></Field>
            <Field label="Venda (R$) *"><input required type="number" value={form.precos.venda} onChange={e => setForm(f => ({...f, precos: {...f.precos, venda: e.target.value}}))} className={inputClass} /></Field>
            <Field label="Mínimo (R$)"><input type="number" value={form.precos.minimo} onChange={e => setForm(f => ({...f, precos: {...f.precos, minimo: e.target.value}}))} className={inputClass} /></Field>
            <Field label="Comissão (R$)"><input type="number" value={form.precos.comissaoEstimada} onChange={e => setForm(f => ({...f, precos: {...f.precos, comissaoEstimada: e.target.value}}))} className={inputClass} /></Field>
          </div>
        </Section>

        <Section title="Condições">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.condicoes.aceitaTroca} onChange={e => setForm(f => ({...f, condicoes: {...f.condicoes, aceitaTroca: e.target.checked}}))} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
              <span className="text-[13px] text-foreground">Aceita troca</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.condicoes.aceitaFinanciamento} onChange={e => setForm(f => ({...f, condicoes: {...f.condicoes, aceitaFinanciamento: e.target.checked}}))} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
              <span className="text-[13px] text-foreground">Aceita financiamento</span>
            </label>
            <Field label="Documentação">
              <select value={form.condicoes.documentacao} onChange={e => setForm(f => ({...f, condicoes: {...f.condicoes, documentacao: e.target.value}}))} className={inputClass}>
                <option value="ok">OK</option><option value="pendente">Pendente</option><option value="irregular">Irregular</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Proprietário">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome"><input value={form.proprietario.nome} onChange={e => setForm(f => ({...f, proprietario: {...f.proprietario, nome: e.target.value}}))} className={inputClass} /></Field>
            <Field label="WhatsApp"><input value={form.proprietario.whatsapp} onChange={e => setForm(f => ({...f, proprietario: {...f.proprietario, whatsapp: e.target.value}}))} className={inputClass} /></Field>
            <Field label="Cidade" className="col-span-2"><input value={form.proprietario.cidade} onChange={e => setForm(f => ({...f, proprietario: {...f.proprietario, cidade: e.target.value}}))} className={inputClass} /></Field>
          </div>
        </Section>

        <Section title="Observações do Anúncio">
          <textarea rows={3} value={form.anuncio.observacoes} onChange={e => setForm(f => ({...f, anuncio: { observacoes: e.target.value }}))}
            className="w-full px-3 py-2 text-[13px] bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none" />
        </Section>

        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="h-9 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground text-[13px] font-medium rounded-md transition-colors flex items-center gap-2">
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Cadastrar veículo'}
          </button>
          <button type="button" onClick={() => navigate('/vehicles')} className="h-9 px-4 bg-muted hover:bg-muted/80 text-foreground text-[13px] font-medium rounded-md transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[12px] font-medium text-foreground mb-1">{label}</label>
      {children}
    </div>
  );
}
